pragma solidity 0.4.24;

import "../BazaaarProtocol.sol";

contract TestBazaaarProtocol is BazaaarProtocol {

    constructor(
    ) BazaaarProtocol(
    ) public {}

    function now_() external view returns (uint) {
        return now;
    }

    function validateOrder_(bytes32 hash, address[7] addrs, uint[8] uints, uint8 v, bytes32 r, bytes32 s)
        external
        view
        returns (bool)
    {
        return validateOrder(
            hash,
            Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], addrs[5], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5], uints[6], uints[7]),
            Sig(v, r, s)
        );
    }

    function distribute_(address[7] addrs, uint[8] uints)
        external
        payable
    {
        distribute(
            Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], addrs[5], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5], uints[6], uints[7]),
            addrs[5]
        );
    }

    function computeAmount_(address[6] addrs, uint[8] uints)
        external
        view
        returns (uint[4])
    {
        Amount memory amount = computeAmount(
            Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], addrs[5], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5], uints[6], uints[7])
            );
        return ([amount.maker, amount.relayerRoyalty, amount.creatorRoyalty, amount.referral]);
    }

    function validateOrderParameters_(address[6] addrs, uint[8] uints)
        external
        view
        returns (bool)
    {
        return validateOrderParameters(Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], addrs[5], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5], uints[6], uints[7]));
    }

    function ecrecover_(bytes32 hash, uint8 v, bytes32 r, bytes32 s)
        external
        pure
        returns (address)
    {
        return ecrecover(hash, v, r, s);
    }

    function hashToSign_(address[6] addrs, uint[8] uints)
        external
        pure
        returns (bytes32)
    {
        return hashToSign(Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], addrs[5], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5], uints[6], uints[7]));
    }

    function hashOrder_(address[6
    ] addrs, uint[8] uints)
        external
        pure
        returns (bytes32 hash)
    {
        return hashOrder(Order(addrs[0], addrs[1], addrs[2], addrs[3], addrs[4], addrs[5], uints[0], uints[1], uints[2], uints[3], uints[4], uints[5], uints[6], uints[7]));
    }

}