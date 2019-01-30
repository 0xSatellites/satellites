var ExtensionAsset = artifacts.require('token/mycryptoextensionAssetes/ExtensionAsset')

contract('Deploy Extension', async function(accounts) {

    const EXTENSIONID1 = 10010064;
    const EXTENSIONID2 = 10010076;
    const EXTENSIONID3 = 10010441;
    const EXTENSIONID4 = 10010823;
    const EXTENSIONID5 = 10010946;
    const EXTENSIONID6 = 10010995;
    const EXTENSIONID7 = 10011467;
    const EXTENSIONID8 = 10011706;
    const EXTENSIONID9 = 10012152;

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