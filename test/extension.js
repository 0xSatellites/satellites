var ExtensionAsset = artifacts.require('token/mycryptoextensionAssetes/ExtensionAsset')
var Bazaaar = artifacts.require('Bazaaar')

contract('Test Extension', async function(accounts) {
  
    const PRICE = 1000000000;

    const EXTENSIONID1 = 30040001;
    const EXTENSIONID2 = 30040002;
    const EXTENSIONID3 = 30040003;
    const EXTENSIONID4 = 30040004;
    const EXTENSIONID5 = 30040005;

    var extensionAsset;

    it('Mint initial token', async function() {
      extensionAsset = await ExtensionAsset.new();   
      await extensionAsset.mint(accounts[0], EXTENSIONID1);
      await extensionAsset.mint(accounts[0], EXTENSIONID2);
      await extensionAsset.mint(accounts[0], EXTENSIONID3);
      await extensionAsset.mint(accounts[0], EXTENSIONID4);
      await extensionAsset.mint(accounts[0], EXTENSIONID5);
      assert.equal(await extensionAsset.balanceOf(accounts[0]), 5);
      assert.equal(await extensionAsset.ownerOf(EXTENSIONID1), accounts[0]);
      assert.equal(await extensionAsset.ownerOf(EXTENSIONID1), accounts[0]);
      assert.equal(await extensionAsset.ownerOf(EXTENSIONID1), accounts[0]);
      assert.equal(await extensionAsset.ownerOf(EXTENSIONID1), accounts[0]);
      assert.equal(await extensionAsset.ownerOf(EXTENSIONID1), accounts[0]);
    })

    it('whitelist', async function() {
        bazaaar = await Bazaaar.deployed();        
        await bazaaar.whitelist(extensionAsset.address, true);
        assert.equal(await bazaaar.whitelisted(extensionAsset.address), true);                
    })

    it('sell', async function() {
        bazaaar = await Bazaaar.deployed();
        await extensionAsset.approve(bazaaar.address, EXTENSIONID1);
        await bazaaar.sell(extensionAsset.address, EXTENSIONID1, PRICE);
        items =  await bazaaar.items(extensionAsset.address, EXTENSIONID1)
        assert.equal(await extensionAsset.ownerOf(EXTENSIONID1), bazaaar.address);        
        assert.equal(items[0], accounts[0]);
        assert.equal(items[1], PRICE);
        assert.equal(items[2], true);
    })    

    it('purchase', async function() {
        bazaaar = await Bazaaar.deployed();
        await bazaaar.purchase(extensionAsset.address, EXTENSIONID1, {from: accounts[1], value: PRICE});
        assert.equal(await extensionAsset.ownerOf(EXTENSIONID1), accounts[1]);
    })    

    it('cancel', async function() {
        bazaaar = await Bazaaar.deployed();
        await extensionAsset.approve(bazaaar.address, EXTENSIONID1, {from: accounts[1]});
        await bazaaar.sell(extensionAsset.address, EXTENSIONID1, PRICE, {from: accounts[1]});
        await bazaaar.cancel(extensionAsset.address, EXTENSIONID1, {from: accounts[1]});
        assert.equal(await extensionAsset.ownerOf(EXTENSIONID1), accounts[1]);        
    })       

})