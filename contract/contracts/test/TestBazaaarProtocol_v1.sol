pragma solidity 0.4.24;

import "../BazaaarProtocol_v1.sol";

contract TestBazaaarProtocol_v1 is BazaaarProtocol_v1 {

    constructor(
    ) BazaaarProtocol_v1(
    ) public {}

    function now_() external view returns (uint) {
        return now;
    }

    function validateOrder_(bytes32 hash, address[5] addrs, uint[7] uints, uint8 v, bytes32 r, bytes32 s)
        external
        view
        returns (bool)
    {
        return validateOrder(
            hash,
            Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5], uints[6]),
            Sig(v, r, s)
        );
    }

    function distribute_(address[6] addrs, uint[7] uints)
        external
        payable
    {
        distribute(
            Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5], uints[6]),
            addrs[5]
        );
    }

    function computeAmount_(address[6] addrs, uint[7] uints)
        external
        view
        returns (uint[3])
    {
        Amount memory amount = computeAmount(
            Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5], uints[6])
            );
        return ([amount.maker, amount.creatorRoyalty, amount.referral]);
    }

    function validateAssetStatus_(address[5] addrs, uint[7] uints)
        external
        view
        returns (bool)
    {
        return validateAssetStatus(Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5], uints[6]));
    }

    function validateOrderParameters_(address[5] addrs, uint[7] uints)
        external
        view
        returns (bool)
    {
        return validateOrderParameters(Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5], uints[6]));
    }

    function ecrecover_(bytes32 hash, uint8 v, bytes32 r, bytes32 s)
        external
        pure
        returns (address)
    {
        return ecrecover(hash, v, r, s);
    }

    function hashToSign_(address[5] addrs, uint[7] uints)
        external
        pure
        returns (bytes32)
    {
        return hashToSign(Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5], uints[6]));
    }

    function hashOrder_(address[5] addrs, uint[7] uints)
        external
        pure
        returns (bytes32 hash)
    {
        return hashOrder(Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5], uints[6]));
    }

}