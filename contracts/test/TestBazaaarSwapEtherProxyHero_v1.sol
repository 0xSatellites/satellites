pragma solidity 0.4.24;

import "../BazaaarSwapEtherProxyHero_v1.sol";

contract TestBazaaarSwapEtherProxyHero_v1 is BazaaarSwapEtherProxyHero_v1 {

    function hashOrder_ (address[2] addrs, uint[3] uints)
        public
        view
        returns (bytes32 hash)
    {
        return hashOrder(Order(address(this), addrs[0], addrs[1], uints[0], uints[1], uints[2]));
    }

}