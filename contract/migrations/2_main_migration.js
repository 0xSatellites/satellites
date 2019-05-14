var BazaaarProtocol = artifacts.require("./BazaaarProtocol.sol");

module.exports = function(deployer) {
  deployer.deploy(BazaaarProtocol)
};