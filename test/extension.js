var ExtensionAsset = artifacts.require('token/mycryptoextensionAssetes/ExtensionAsset')
var Bazaaar = artifacts.require('Bazaaar')

contract('Deploy Extension', async function(accounts) {

    const EXTENSIONID1 = 10012160;
    const EXTENSIONID2 = 10012161;
    const EXTENSIONID3 = 10012162;
    const EXTENSIONID4 = 10012163;
    const EXTENSIONID5 = 10012164;
    const EXTENSIONID6 = 10012165;
    const EXTENSIONID7 = 10012166;
    const EXTENSIONID8 = 10012167;
    const EXTENSIONID9 = 10012168;

    it('Mint initial token', async function() {
      var extensionAsset = await ExtensionAsset.new();
      console.log("Extension Address: " + extensionAsset.address)
      await extensionAsset.mint(accounts[0], EXTENSIONID1);
      await extensionAsset.mint(accounts[0], EXTENSIONID2);
      await extensionAsset.mint(accounts[0], EXTENSIONID3);
      await extensionAsset.mint(accounts[0], EXTENSIONID4);
      await extensionAsset.mint(accounts[0], EXTENSIONID5);
      await extensionAsset.mint(accounts[0], EXTENSIONID6);
      await extensionAsset.mint(accounts[0], EXTENSIONID7);
      await extensionAsset.mint(accounts[0], EXTENSIONID8);
      await extensionAsset.mint(accounts[0], EXTENSIONID9);

    })

})