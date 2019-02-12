var BazaaarProtocol_v1 = artifacts.require("./BazaaarProtocol_v1.sol");

module.exports = function(deployer) {
  deployer.deploy(BazaaarProtocol_v1)
};