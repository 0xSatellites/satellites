var EtherDistributer = artifacts.require("./EtherDistributer.sol");

module.exports = function(deployer) {
  deployer.deploy(EtherDistributer)
};