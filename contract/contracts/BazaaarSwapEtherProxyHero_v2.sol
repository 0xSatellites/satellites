pragma solidity 0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import "../node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../node_modules/openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";

contract BazaaarSwapEtherProxyHero_v2 is Pausable, ReentrancyGuard {
    using SafeMath for uint;

    event OrderCancelled(bytes32 indexed hash);
    event OrderMatched(bytes32 indexed hash);

    struct Order {
        address proxy;
        address maker;
        address taker;
        address creatorRoyaltyRecipient;
        address asset;
        uint id;
        uint price;
        uint creatorRoyaltyRatio;
        uint salt;
        uint expiration;
        uint nonce;
    }

    struct Referral {
        address recipient;
        uint ratio;
    }

    struct Amount {
        uint maker;
        uint creatorRoyalty;
        uint referral;
    }

    struct Sig {
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    mapping(bytes32 => bool) public cancelledOrFinalized;
    mapping(address=>mapping(uint=>uint)) nonce;

    uint public ratioBase = 10000;

    constructor() public {}

    function orderMatch_(address[6] addrs, uint[7] uints, uint8 v, bytes32 r, bytes32 s) external payable whenNotPaused nonReentrant {
        orderMatch(
            Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5]),
            Sig(v, r, s)
        );
        distribute(
            Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5]),
            Referral(addrs[5], uints[6])
        );
    }

    function orderCancell_(address[5] addrs, uint[6] uints, uint8 v, bytes32 r, bytes32 s) external {
        orderCancell(
            Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5]),
            Sig(v, r, s)
        );
    }

    function requireValidOrder_(address[5] addrs, uint[6] uints, uint8 v, bytes32 r, bytes32 s)
        external
        view
        returns (bytes32)
    {
        return requireValidOrder(
            Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5]),
            Sig(v, r, s)
        );
    }

    function distribute(Order memory order, Referral memory referral) internal {
        IERC721(order.asset).transferFrom(order.maker, msg.sender, order.id);
        Amount memory amount = computeAmount(order, referral);

        if(amount.maker > 0 ){
            order.maker.transfer(amount.maker);
        }
        if(amount.creatorRoyalty > 0){
            order.creatorRoyaltyRecipient.transfer(amount.creatorRoyalty);
        }
        if(amount.referral > 0){
            referral.recipient.transfer(amount.referral);
        }
    }

    function computeAmount(Order memory order, Referral memory referral) internal view returns (Amount memory amount) {
        if(order.creatorRoyaltyRecipient != address(this)){
            amount.creatorRoyalty = order.price.mul(order.creatorRoyaltyRatio).div(ratioBase);
        }
        if(referral.recipient != address(this)) {
            amount.referral = order.price.mul(referral.ratio).div(ratioBase);
        }
        amount.maker = order.price.sub(amount.creatorRoyalty).sub(amount.referral);
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
        if (IERC721(order.asset).ownerOf(order.id) != order.maker) {
            return false;
        }
        if (IERC721(order.asset).getApproved(order.id) != address(this) && !IERC721(order.asset).isApprovedForAll(order.maker, address(this)) ) {
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
        if (order.expiration < now) {
            return false;
        }
        if (order.nonce != nonce[order.asset][order.id]) {
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
                order.creatorRoyaltyRecipient,
                order.asset,
                order.id,
                order.price,
                order.creatorRoyaltyRatio,
                order.salt,
                order.expiration,
                order.nonce
        ));
    }
}
