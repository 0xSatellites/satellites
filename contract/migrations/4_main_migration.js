var BazaaarProtocol_v3 = artifacts.require("./BazaaarProtocol_v3.sol");

module.exports = function(deployer) {
  deployer.deploy(BazaaarProtocol_v3)
};