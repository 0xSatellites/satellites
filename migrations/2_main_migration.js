var BazaaarSwapEtherProxyHero_v1 = artifacts.require("./BazaaarSwapEtherProxyHero_v1.sol");

module.exports = function(deployer) {
  deployer.deploy(BazaaarSwapEtherProxyHero_v1, "0x74b0edfbb5698ad379a7b4592c3993b4857b59d6");
};