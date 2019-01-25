pragma solidity 0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/access/roles/SignerRole.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import "../node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../node_modules/openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";

contract BazaaarSwapEtherProxyHero_v1 is SignerRole, Pausable, ReentrancyGuard {
    using SafeMath for uint;

    event OrderCancelled(bytes32 indexed hash);
    event OrderMatched(bytes32 indexed hash);

    struct Order {
        address proxy;
        address maker;
        address taker;
        address artEditRoyaltyRecipient;
        uint id;
        uint price;
        uint artEditRoyaltyRatio;
        uint salt;
    }

    struct Amount {
        uint maker;
        uint referral;
        uint artEditRoyalty;
        uint assetRoyalty;
    }

    struct Sig {
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    mapping(bytes32 => bool) public cancelledOrFinalized;

    uint public ratioBase;
    uint public feeRatio;
    uint public referralRatio;
    uint public assetRoyaltyRatio;
    uint public artEditRoyaltyRatioLimit;

    address assetRoyaltyRecipient;
    IERC721 public asset;

    constructor(address assetAddress, address assetRoyaltyRecipientAddress, uint[5] uints) public {
        asset = IERC721(assetAddress);
        assetRoyaltyRecipient = assetRoyaltyRecipientAddress;
        ratioBase = uints[0];
        feeRatio = uints[1];
        referralRatio = uints[2];
        assetRoyaltyRatio = uints[3];
        artEditRoyaltyRatioLimit = uints[4];
    }

    function withdraw() external onlySigner {
        msg.sender.transfer(address(this).balance);
    }

    function update(address assetRoyaltyRecipientAddress, uint[4] uints) external whenPaused onlySigner {
        assetRoyaltyRecipient = assetRoyaltyRecipientAddress;
        ratioBase = uints[0];
        feeRatio = uints[1];
        referralRatio = uints[2];
        assetRoyaltyRatio = uints[3];
    }

    function orderMatch_(address[5] addrs, uint[4] uints, uint8 v, bytes32 r, bytes32 s) external payable whenNotPaused nonReentrant {
        orderMatch(
            Order(addrs[0], addrs[1], addrs[2], addrs[3], uints[0], uints[1], uints[2], uints[3]),
            Sig(v, r, s)
        );
        distribute(
            Order(addrs[0], addrs[1], addrs[2], addrs[3], uints[0], uints[1], uints[2], uints[3]),
            addrs[4]
        );
    }

    function orderCancell_(address[4] addrs, uint[4] uints, uint8 v, bytes32 r, bytes32 s) external {
        orderCancell(
            Order(addrs[0], addrs[1], addrs[2], addrs[3], uints[0], uints[1], uints[2], uints[3]),
            Sig(v, r, s)
        );
    }

    function requireValidOrder_(address[4] addrs, uint[4] uints, uint8 v, bytes32 r, bytes32 s)
        external
        view
        returns (bytes32)
    {
        return requireValidOrder(
            Order(addrs[0], addrs[1], addrs[2], addrs[3], uints[0], uints[1], uints[2], uints[3]),
            Sig(v, r, s)
        );
    }

    function distribute(Order memory order, address referralRecipient) internal {
        asset.transferFrom(order.maker, msg.sender, order.id);
        Amount memory amount = computeAmount(order);
        order.maker.transfer(amount.maker);
        referralRecipient.transfer(amount.referral);
        order.artEditRoyaltyRecipient.transfer(amount.artEditRoyalty);
        assetRoyaltyRecipient.transfer(amount.assetRoyalty);
    }

    function computeAmount(Order memory order)
        internal
        view
        returns (Amount)
    {
        uint fee = order.price.mul(feeRatio).div(ratioBase);
        uint maker = order.price.sub(fee);
        uint referral = order.price.mul(referralRatio).div(ratioBase);
        uint arteditRoyalty = order.price.mul(order.artEditRoyaltyRatio).div(ratioBase);
        uint remaining = fee.sub(arteditRoyalty).sub(referral);
        uint assetRoyalty = remaining.mul(assetRoyaltyRatio).div(ratioBase);
        return (Amount(maker, referral, arteditRoyalty, assetRoyalty));
    }

    function orderMatch(Order memory order, Sig memory sig) internal {
        require(order.maker != msg.sender);
        require(order.taker == address(0x0) || order.taker == msg.sender);
        require(order.price == msg.value);

        bytes32 hash = requireValidOrder(order, sig);
        cancelledOrFinalized[hash] = true;
        emit OrderMatched(hash);
    }

    function orderCancell(Order memory order, Sig memory sig) internal {
        require(order.maker == msg.sender);
        bytes32 hash = requireValidOrder(order, sig);
        cancelledOrFinalized[hash] = true;
        emit OrderCancelled(hash);
    }

    function requireValidOrder(Order memory order, Sig memory sig)
        internal
        view
        returns (bytes32)
    {
        bytes32 hash = hashToSign(order);
        require(validateOrder(hash, order, sig));
        return hash;
    }

    function validateOrder(bytes32 hash, Order memory order, Sig memory sig)
        internal
        view
        returns (bool)
    {
        if (!validateAssetStatus(order)) {
            return false;
        }
        if (!validateOrderParameters(order)) {
            return false;
        }
        if (cancelledOrFinalized[hash]) {
            return false;
        }
        if (ecrecover(hash, sig.v, sig.r, sig.s) == order.maker) {
            return true;
        }
        return false;
    }

    function validateAssetStatus(Order memory order)
        internal
        view
        returns (bool)
    {
        if (asset.ownerOf(order.id) != order.maker) {
            return false;
        }
        if (asset.getApproved(order.id) != address(this) && !asset.isApprovedForAll(order.maker, address(this)) ) {
            return false;
        }
        return true;
    }

    function validateOrderParameters(Order memory order)
        internal
        view
        returns (bool)
    {
        if (order.proxy != address(this)) {
            return false;
        }
        if (order.artEditRoyaltyRatio > artEditRoyaltyRatioLimit) {
            return false;
        }
        return true;
    }

    function hashToSign(Order memory order)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                hashOrder(order)
            ));
    }

    function hashOrder(Order memory order)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(
            abi.encodePacked(
                order.proxy,
                order.maker,
                order.taker,
                order.artEditRoyaltyRecipient,
                order.id,
                order.price,
                order.artEditRoyaltyRatio,
                order.salt
        ));
    }
}