var BazaaarSwapEtherProxyHero = artifacts.require("./BazaaarSwapEtherProxyHero.sol");

module.exports = function(deployer) {
  deployer.deploy(BazaaarSwapEtherProxyHero);
};