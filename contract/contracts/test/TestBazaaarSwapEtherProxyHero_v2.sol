pragma solidity 0.4.24;

import "../BazaaarSwapEtherProxyHero_v2.sol";

contract TestBazaaarSwapEtherProxyHero_v2 is BazaaarSwapEtherProxyHero_v2 {

    constructor(
    ) BazaaarSwapEtherProxyHero_v2(
    ) public {}

    function cancelledOrFinalized_(bytes32 hash)
        public
    {
        cancelledOrFinalized[hash] = true;
    }

    function validateOrder_(bytes32 hash, address[5] addrs, uint[6] uints, uint8 v, bytes32 r, bytes32 s)
        external
        view
        returns (bool)
    {
        return validateOrder(
            hash,
            Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5]),
            Sig(v, r, s)
        );
    }

    function distribute_(address[6] addrs, uint[7] uints)
        external
        payable
    {
        distribute(
            Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5]),
            Referral(addrs[5], uints[4])
        );
    }

    function computeAmount_(address[6] addrs, uint[7] uints)
        external
        view
        returns (uint[3])
    {
        Amount memory amount = computeAmount(
            Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5]),
            Referral(addrs[5], uints[6])
            );
        return ([amount.maker, amount.creatorRoyalty, amount.referral]);
    }

    function validateAssetStatus_(address[5] addrs, uint[6] uints)
        external
        view
        returns (bool)
    {
        return validateAssetStatus(Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5]));
    }

    function validateOrderParameters_(address[5] addrs, uint[6] uints)
        external
        view
        returns (bool)
    {
        return validateOrderParameters(Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5]));
    }

    function ecrecover_(bytes32 hash, uint8 v, bytes32 r, bytes32 s)
        external
        pure
        returns (address)
    {
        return ecrecover(hash, v, r, s);
    }

    function hashToSign_(address[5] addrs, uint[6] uints)
        external
        pure
        returns (bytes32)
    {
        return hashToSign(Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5]));
    }

    function hashOrder_(address[5] addrs, uint[6] uints)
        external
        pure
        returns (bytes32 hash)
    {
        return hashOrder(Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5]));
    }

}