pragma solidity 0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";


/**
 * Title  :  RentalBazaaarProtocol
 * Asset  :  ERC721
 * Author :  BlockBase
 */

 
 //ToDo timestamp check

contract ERC721 {
    function isApprovedForAll(address owner, address operator) public view returns (bool);
    function setApprovalForAll(address to, bool approved) public;
    function balanceOf(address owner) public view returns (uint256 count);
    function ownerOf(uint256 tokenId) public view returns (address owner);
    function transferFrom(address _from, address _to, uint256 _tokenId) public;
}
//貸し出し出品の時

contract RentalBazaaarProtocol is Pausable {
    using SafeMath for uint;

    event OrderMatched(
        bytes32 indexed hash,
        address maker,
        address taker,
        address asset,
        uint id
    );
    event OrderCancelled(
        bytes32 indexed hash,
        address maker,
        address asset,
        uint id
    );

    struct Order {
        address proxy;
        address maker;
        address taker;
        address relayerRoyaltyRecipient;
        address asset;
        uint id;
        uint rentalPeriod;
        uint rentalFee;
        uint depositAmount;
        uint nonce;
        uint salt;
        uint expiration;
        uint relayerRoyaltyRatio;
        uint referralRatio;
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

    uint public ratioBase = 10000;
    mapping(address=>mapping(address=>mapping(uint=>uint))) private nonce;
    
    mapping (bytes32=>uint) private rentalStartedAt;

    function nonce_(address maker, address asset, uint id)
        external
        view
        returns (uint)
    {
        return nonce[maker][asset][id];
    }


    function rentalStartedAt_(bytes32 hash) 
      external
      view
      returns (uint)
    {
        return rentalStartedAt[hash];
    }

    function returnAsset_(address[5] addrs, uint[9] uints) 
      external
      whenNotPaused
    {
        returnAsset(
            Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5], uints[6], uints[7], uints[8])
            );
    }

    function returnAsset(Order memory order)
        internal
    {
        bytes32 hash = hashToSign(order); 
        require(rentalStartedAt[hash] != 0);
        delete rentalStartedAt[hash];
        uint rentaledDays = now.sub(rentalStartedAt[hash]).div(1 days);
        require(rentaledDays <= order.rentalPeriod);
        uint actualRentalFee = rentaledDays.mul(order.rentalFee);
        ERC721(order.asset).transferFrom(msg.sender, order.maker, order.id);
        msg.sender.transfer(actualRentalFee);
    }

    function takerAwayDeposit_(address[6] addrs, uint[9] uints) 
      external
      whenNotPaused
    {
        takerAwayDeposit(
            Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5], uints[6], uints[7], uints[8])
            );
    }

    function takerAwayDeposit(Order memory order)
        internal
    {
        require(msg.sender == order.maker);
        bytes32 hash = hashToSign(order); 
        require(rentalStartedAt[hash] != 0);
        delete rentalStartedAt[hash];
        uint rentaledDays = now.sub(rentalStartedAt[hash]).div(1 days);
        require(rentaledDays > order.rentalPeriod);
        msg.sender.transfer(order.depositAmount);
    }
    
    function orderCancel_(address[5] addrs, uint[9] uints) external {
        orderCancel(
            Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5], uints[6], uints[7], uints[8])
        );
    }

    function orderMatch_(address[6] addrs, uint[9] uints, uint8 v, bytes32 r, bytes32 s)
        external
        payable
        whenNotPaused
    {
        orderMatch(
            Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5], uints[6], uints[7], uints[8]),
            Sig(v, r, s)
        );
    }

    function requireValidOrder_(address[5] addrs, uint[9] uints, uint8 v, bytes32 r, bytes32 s)
        external
        view
        returns (bytes32)
    {
        return requireValidOrder(
            Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5], uints[6], uints[7], uints[8]),
            Sig(v, r, s)
        );
    }

    function orderCancel(Order memory order) internal {
        require(order.maker == msg.sender);
        bytes32 hash = hashToSign(order);
        nonce[order.maker][order.asset][order.id]++;
        emit OrderCancelled(hash, order.maker, order.asset, order.id);
    }


    function orderMatch(Order memory order, Sig memory sig)
        internal
    {
        require(order.maker != msg.sender);
        require(order.taker == address(0x0) || order.taker == msg.sender);
        require(order.depositAmount == msg.value);
        bytes32 hash = requireValidOrder(order, sig);
        require(rentalStartedAt[hash] == 0);
        rentalStartedAt[hash] = now;
        nonce[order.maker][order.asset][order.id]++;
        ERC721(order.asset).transferFrom(order.maker, msg.sender, order.id);
        emit OrderMatched(hash, order.maker, msg.sender ,order.asset, order.id);
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
        if (!validateOrderParameters(order)) {
            return false;
        }
        if (ecrecover(hash, sig.v, sig.r, sig.s) == order.maker) {
            return true;
        }
        return false;
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
        if (order.nonce != nonce[order.maker][order.asset][order.id]) {
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
                order.relayerRoyaltyRecipient,
                order.asset,
                order.id,
                order.rentalPeriod,
                order.rentalFee,
                order.depositAmount,
                order.nonce,
                order.salt,
                order.expiration,
                order.relayerRoyaltyRatio,
                order.referralRatio
        ));
    }
}
