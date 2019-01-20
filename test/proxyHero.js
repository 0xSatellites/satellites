var bazaaarSwapEtherProxyHero_v1 = artifacts.require('BazaaarSwapEtherProxyHero_v1')
var testBazaaarSwapEtherProxyHero_v1 = artifacts.require('test/TestBazaaarSwapEtherProxyHero_v1')
var HeroAsset = artifacts.require('tokens/MyCryptoHeroes/HeroAsset')

var Web3 = require('web3');

const web3Eth = new Web3(web3.currentProvider).eth;
const Web3Utils = new Web3(web3.currentProvider).utils;
const Web3Personal = new Web3(web3.currentProvider).personal;

contract('Test BazaaarSwapEtherProxyHero_v1', async function(accounts) {

    var contract;
    var test;
    var heroAsset;

    var account1 = accounts[0];
    var account2 = accounts[1];
    var privkey1 = "0xddff83537c186192c39d7db961a606096592792e3b1daeeae490eb5e3b9e2186";

    const HEROID1 = 40090001;
    const HEROID2 = 40090002;
    const HEROID3 = 40090003;
    const HEROID4 = 40090004;
    const HEROID5 = 40090005;
    const HEROID6 = 40090006;
    const HEROID7 = 40090007;
    const HEROID8 = 40090008;
    const HEROID9 = 40090009;

    it('Setup', async function() {
        heroAsset = await HeroAsset.new();
        contract =  await bazaaarSwapEtherProxyHero_v1.new(heroAsset.address);
        test =  await testBazaaarSwapEtherProxyHero_v1.new(heroAsset.address);
    })

    it('Method: hashOrder', async function() {
        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            proxy: test.address,
            maker: account1,
            address: account1,
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
            order.proxy,
            order.maker,
            order.address,
        ], [
            order.id,
            order.price,
            order.salt
        ])

        assert.equal(data, result);
    })

    it('Method: hashToSign', async function() {

        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            proxy: test.address,
            maker: account1,
            address: account1,
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

        var presignedData = Web3Utils.soliditySha3(
            "\x19Ethereum Signed Message:\n32",
            data
        );

        var result = await test.hashToSign_([
            order.proxy,
            order.maker,
            order.address,
        ], [
            order.id,
            order.price,
            order.salt
        ])

        assert.equal(presignedData, result);
    })

    it('Method: ecrecover', async function() {

        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            proxy: test.address,
            maker: account1,
            address: account1,
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

        var presignedData = Web3Utils.soliditySha3(
            "\x19Ethereum Signed Message:\n32",
            data
        );

        var sig = web3Eth.accounts.sign(data, privkey1);

        var result = await test.ecrecover_(
            presignedData,
            sig.v,
            sig.r,
            sig.s
        )

        assert.equal(account1, result);
    })

    it('Method: validateOrderParameters', async function() {

        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            proxy: test.address,
            maker: account1,
            address: account1,
            id: HEROID1,
            price: 10000,
            salt: salt
        }

        var result = await test.validateOrderParameters_([
            order.proxy,
            order.maker,
            order.address,
        ], [
            order.id,
            order.price,
            order.salt
        ])

        assert.equal(true, result, "Proxy address: positive");

        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            //Input wrong address
            proxy: contract.address,
            maker: account1,
            address: account1,
            id: HEROID1,
            price: 10000,
            salt: salt
        }

        var result = await test.validateOrderParameters_([
            order.proxy,
            order.maker,
            order.address,
        ], [
            order.id,
            order.price,
            order.salt
        ])

        assert.equal(false, result, "Proxy address: negative");

    })

    it('Method: validateOrder', async function() {

        //!validateOrderParameters(order)
        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            proxy: test.address,
            maker: account1,
            address: account1,
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

        var presignedData = Web3Utils.soliditySha3(
            "\x19Ethereum Signed Message:\n32",
            data
        );

        var sig = web3Eth.accounts.sign(data, privkey1);

        var result = await test.validateOrder_(
            presignedData,
        [
            order.proxy,
            order.maker,
            order.address,
        ], [
            order.id,
            order.price,
            order.salt
        ],
            sig.v,
            sig.r,
            sig.s
        )

        assert.equal(true, result, "Proxy address: positive");

        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            //Input wrong address
            proxy: contract.address,
            maker: account1,
            address: account1,
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

        var presignedData = Web3Utils.soliditySha3(
            "\x19Ethereum Signed Message:\n32",
            data
        );

        var sig = web3Eth.accounts.sign(data, privkey1);

        var result = await test.validateOrder_(
            presignedData,
        [
            order.proxy,
            order.maker,
            order.address,
        ], [
            order.id,
            order.price,
            order.salt
        ],
            sig.v,
            sig.r,
            sig.s
        )

        assert.equal(false, result, "Proxy address: negative");

        //cancelledOrFinalized[hash]
        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            proxy: test.address,
            maker: account1,
            address: account1,
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

        var presignedData = Web3Utils.soliditySha3(
            "\x19Ethereum Signed Message:\n32",
            data
        );

        var sig = web3Eth.accounts.sign(data, privkey1);

        var result = await test.validateOrder_(
            presignedData,
        [
            order.proxy,
            order.maker,
            order.address,
        ], [
            order.id,
            order.price,
            order.salt
        ],
            sig.v,
            sig.r,
            sig.s
        )

        assert.equal(true, result, "Before finalize order");

        await test.cancelledOrFinalized_(presignedData);
        var result = await test.cancelledOrFinalized(presignedData);
        assert.equal(true, result);

        var result = await test.validateOrder_(
            presignedData,
        [
            order.proxy,
            order.maker,
            order.address,
        ], [
            order.id,
            order.price,
            order.salt
        ],
            sig.v,
            sig.r,
            sig.s
        )

        assert.equal(false, result, "After finalize order");

        //ecrecover(hash, sig.v, sig.r, sig.s) == order.maker
        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            proxy: test.address,
            maker: account1,
            address: account1,
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

        var presignedData = Web3Utils.soliditySha3(
            "\x19Ethereum Signed Message:\n32",
            data
        );

        var sig = web3Eth.accounts.sign(data, privkey1);

        var result = await test.validateOrder_(
            presignedData,
        [
            order.proxy,
            order.maker,
            order.address,
        ], [
            order.id,
            order.price,
            order.salt
        ],
            sig.v,
            sig.r,
            sig.s
        )

        assert.equal(true, result, "Positive ecrecover");

        var result = await test.validateOrder_(
            presignedData,
        [
            order.proxy,
            order.maker,
            order.address,
        ], [
            order.id,
            order.price,
            order.salt
        ],
            sig.v,
            //Put wrong signature
            sig.s,
            sig.r
        )

        assert.equal(false, result, "negative ecrecover");

    })

    it('Method: requireValidOrder', async function() {

        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            proxy: test.address,
            maker: account1,
            address: account1,
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

        var presignedData = Web3Utils.soliditySha3(
            "\x19Ethereum Signed Message:\n32",
            data
        );

        var sig = web3Eth.accounts.sign(data, privkey1);

        var result = await test.requireValidOrder_([
            order.proxy,
            order.maker,
            order.address,
        ], [
            order.id,
            order.price,
            order.salt
        ],
            sig.v,
            sig.r,
            sig.s
        )

        assert.equal(presignedData, result);

    })

    it('Variable: cancelledOrFinalized (HEROID1)', async function() {

        await heroAsset.mint(account1, HEROID1);
        var result = await heroAsset.ownerOf(HEROID1);
        assert.equal(result, account1);

        await heroAsset.approve(contract.address, HEROID1);
        var result = await heroAsset.getApproved(HEROID1)
        assert.equal(result, contract.address);

        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            proxy: contract.address,
            maker: account1,
            address: account1,
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

        var presignedData = Web3Utils.soliditySha3(
            "\x19Ethereum Signed Message:\n32",
            data
        );

        var sig = web3Eth.accounts.sign(data, privkey1);

        var result = await contract.cancelledOrFinalized(presignedData);
        assert.equal(false, result, "Before Order Matched");

        var result = await contract.orderMatch_([
            order.proxy,
            order.maker,
            order.address,
        ], [
            order.id,
            order.price,
            order.salt
        ], sig.v,
           sig.r,
           sig.s,
           { from: account2 }
        )

        var result = await heroAsset.ownerOf(HEROID1);
        assert.equal(result, account2);

        var result = await contract.cancelledOrFinalized(presignedData);
        assert.equal(true, result, "After Order Matched");

        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            proxy: contract.address,
            maker: account1,
            address: account1,
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

        var presignedData = Web3Utils.soliditySha3(
            "\x19Ethereum Signed Message:\n32",
            data
        );

        var sig = web3Eth.accounts.sign(data, privkey1);

        var result = await contract.cancelledOrFinalized(presignedData);
        assert.equal(false, result, "Before Order Cancelled");

        var result = await contract.orderCancell_([
            order.proxy,
            order.maker,
            order.address,
        ], [
            order.id,
            order.price,
            order.salt
        ], sig.v,
           sig.r,
           sig.s,
           { from: account1 }
        )

        var result = await contract.cancelledOrFinalized(presignedData);
        assert.equal(true, result, "After Order Cancelled");

    })



    /*
    it('Scenario: purchase hero', async function() {
        await heroAsset.mint(accounts[0], HEROID1);
        var result = await heroAsset.ownerOf(HEROID1);
        assert.equal(result, accounts[0]);

        contract = await bazaaarSwapEtherProxyHero_v1.new(heroAsset.address);
        await heroAsset.approve(contract.address, HEROID1);

        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            proxy: contract.address,
            maker: account1,
            address: account1,
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

        var sig = web3Eth.accounts.sign(data, privkey1);

        var result = await contract.orderMatch_([
            order.proxy,
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
    */

})