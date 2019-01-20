pragma solidity 0.4.24;

import "../BazaaarSwapEtherProxyHero_v1.sol";

contract TestBazaaarSwapEtherProxyHero_v1 is BazaaarSwapEtherProxyHero_v1 {

    constructor(address assetAddress) BazaaarSwapEtherProxyHero_v1(assetAddress) public {
    }

    function cancelledOrFinalized_(bytes32 hash)
        public
    {
        cancelledOrFinalized[hash] = true;
    }

    function validateOrder_(bytes32 hash, address[3] addrs, uint[3] uints, uint8 v, bytes32 r, bytes32 s)
        public
        view
        returns (bool)
    {
        return validateOrder(
            hash,
            Order(addrs[0], addrs[1], addrs[2], uints[0], uints[1], uints[2]),
            Sig(v, r, s)
        );
    }

    function validateOrderParameters_(address[3] addrs, uint[3] uints)
        public
        view
        returns (bool)
    {
        return validateOrderParameters(Order(addrs[0], addrs[1], addrs[2], uints[0], uints[1], uints[2]));
    }

    function ecrecover_(bytes32 hash, uint8 v, bytes32 r, bytes32 s)
        public
        pure
        returns (address)
    {
        return ecrecover(hash, v, r, s);
    }

    function hashToSign_(address[3] addrs, uint[3] uints)
        public
        pure
        returns (bytes32)
    {
        return hashToSign(Order(addrs[0], addrs[1], addrs[2], uints[0], uints[1], uints[2]));
    }

    function hashOrder_(address[3] addrs, uint[3] uints)
        public
        pure
        returns (bytes32 hash)
    {
        return hashOrder(Order(addrs[0], addrs[1], addrs[2], uints[0], uints[1], uints[2]));
    }

}