pragma solidity 0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import "../node_modules/openzeppelin-solidity/contracts/access/roles/SignerRole.sol";
import "../node_modules/openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";

contract BazaaarSwapEtherProxyHero_v1 is SignerRole, ReentrancyGuard {
        
    event OrderCancelled(bytes32 indexed hash);
    event OrdersMatched(bytes32 indexed hash);

    mapping(bytes32 => bool) public cancelledOrFinalized;
    IERC721 asset;

    struct Sig {
        uint8 v;
        bytes32 r;
        bytes32 s;        
    }

    struct Order {
        address proxy;
        address maker;
        address feeRecipient;
        uint id;
        uint price;
        uint salt;
    }

    constructor(address assetAddress) public {
        asset = IERC721(assetAddress);
    }

    function orderMatch_(address[2] addrs, uint[3] uints, uint8 v, bytes32 r, bytes32 s) public payable {
        orderMatch(
            Order(address(this), addrs[0], addrs[1], uints[0], uints[1], uints[2]),
            Sig(v, r, s)
        );
    }

    function orderMatch(Order order, Sig sig) internal {
        bytes32 hash = requireValidOrder(order, sig);
        cancelledOrFinalized[hash] = true;
        asset.transferFrom(order.maker, msg.sender, order.id);
        emit OrdersMatched(hash);
    }

    function orderCancell_(address[2] addrs, uint[3] uints, uint8 v, bytes32 r, bytes32 s) public payable {
        orderCancell(
            Order(address(this), addrs[0], addrs[1], uints[0], uints[1], uints[2]),
            Sig(v, r, s)
        );
    }    

    function orderCancell(Order order, Sig sig) internal {
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


    function validateOrderParameters(Order memory order)
        internal
        view
        returns (bool)
    {
        if (order.proxy != address(this)) {
            return false;
        }
        return true;
    }

    function hashToSign(Order memory order)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hashOrder(order)));
    }

    function hashOrder(Order memory order)
        internal
        pure
        returns (bytes32 hash)
    {
        return keccak256(abi.encodePacked(
            order.proxy, 
            order.maker, 
            order.feeRecipient,
            order.id,
            order.price,
            order.salt
        ));
    }

}