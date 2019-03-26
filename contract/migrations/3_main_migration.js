var BazaaarProtocol_v2 = artifacts.require("./BazaaarProtocol_v2.sol");

module.exports = function(deployer) {
  deployer.deploy(BazaaarProtocol_v2)
};