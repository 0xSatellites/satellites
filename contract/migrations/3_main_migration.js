var EtherDistributer_v1 = artifacts.require("./EtherDistributer_v1.sol");

module.exports = function(deployer) {
  deployer.deploy(EtherDistributer_v1)
};