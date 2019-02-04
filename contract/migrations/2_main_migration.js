var BazaaarSwapEtherProxyHero_v1 = artifacts.require("./BazaaarSwapEtherProxyHero_v1.sol");

module.exports = function(deployer) {
  deployer.deploy(BazaaarSwapEtherProxyHero_v1)
};