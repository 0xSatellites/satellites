var EtherDistributer_v1 = artifacts.require("./EtherDistributer_v1.sol");

module.exports = function(deployer) {
  deployer.deploy(EtherDistributer_v1, "0xf9b744152a6897198b9B9999d8d340b59807595E", "0xfEB6acd9701aD1A9A33bFe4CA9AB122403974A23")
};