var BazaaarSwapEtherProxyHero_v1 = artifacts.require("./BazaaarSwapEtherProxyHero_v1.sol");

module.exports = function(deployer) {
  deployer.deploy(BazaaarSwapEtherProxyHero_v1, "0xA217212236c24834eD1648fD20da869F686C96A7");
};