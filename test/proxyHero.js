var bazaaarSwapEtherProxyHero_v1 = artifacts.require('BazaaarSwapEtherProxyHero_v1')
var testBazaaarSwapEtherProxyHero_v1 = artifacts.require('TestBazaaarSwapEtherProxyHero_v1')
var HeroAsset = artifacts.require('tokens/MyCryptoHeroes/HeroAsset')

contract('Test BazaaarSwapEtherProxyHero_v1', async function(accounts) {

    var Web3 = require('web3');

    const web3Eth = new Web3(web3.currentProvider).eth;
    const Web3Utils = new Web3(web3.currentProvider).utils;
    const Web3Personal = new Web3(web3.currentProvider).personal ;

    var heroAsset = await HeroAsset.new();  
    var contract =  await bazaaarSwapEtherProxyHero_v1.new(heroAsset.address);
    var test =  await TestBazaaarSwapEtherProxyHero_v1.new(heroAsset.address);

    const HEROID1 = 40090001;
    const HEROID2 = 40090002;
    const HEROID3 = 40090003;
    const HEROID4 = 40090004;
    const HEROID5 = 40090005;
    const HEROID6 = 40090006;
    const HEROID7 = 40090007;
    const HEROID8 = 40090008;
    const HEROID9 = 40090009;    

    it('Scenario: purchase hero', async function() {
        
        await heroAsset.mint(accounts[0], HEROID1);
        var result = await heroAsset.ownerOf(HEROID1);
        assert.equal(result, accounts[0]);             

        contract = await bazaaarSwapEtherProxyHero_v1.new(heroAsset.address);
        await heroAsset.approve(contract.address, HEROID1);

        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            proxy: contract.address,
            maker: "0x74b0edfbb5698ad379a7b4592c3993b4857b59d6",
            address: "0x74b0edfbb5698ad379a7b4592c3993b4857b59d6",
            id: HEROID1,
            price: 10000,
            salt: salt
        }

        var data = Web3Utils.soliditySha3(
            order.proxy, 
            order.maker, 
            order.address, 
            order.id, 
            order.price, 
            order.salt
        );

        var sig = web3Eth.accounts.sign(data, "0xddff83537c186192c39d7db961a606096592792e3b1daeeae490eb5e3b9e2186");

        var result = await contract.orderMatch_([
            order.maker, 
            order.address, 
        ], [
            order.id, 
            order.price, 
            order.salt
        ], sig.v,
           sig.r,
           sig.s,
           { from: accounts[1] }
        )

        var result = await heroAsset.ownerOf(HEROID1);
        assert.equal(result, accounts[1]);        
    })


    it('Method: hashOrder', async function() {

        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            proxy: contract.address,
            maker: "0x74b0edfbb5698ad379a7b4592c3993b4857b59d6",
            address: "0x74b0edfbb5698ad379a7b4592c3993b4857b59d6",
            id: HEROID1,
            price: 10000,
            salt: salt
        }

        var data = Web3Utils.soliditySha3(
            order.proxy, 
            order.maker, 
            order.address, 
            order.id, 
            order.price, 
            order.salt
        );

        var result = await test.hashOrder_([
            order.maker, 
            order.address, 
        ], [
            order.id, 
            order.price, 
            order.salt
        ])

        assert.equal(data, result);        
    })
    
    
})