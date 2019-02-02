var bazaaarSwapEtherProxyHero_v2 = artifacts.require('BazaaarSwapEtherProxyHero_v2')
var testBazaaarSwapEtherProxyHero_v2 = artifacts.require('test/TestBazaaarSwapEtherProxyHero_v2')
var HeroAsset = artifacts.require('tokens/MyCryptoHeroes/HeroAsset')

var Web3 = require('web3');

const web3Eth = new Web3(web3.currentProvider).eth;
const Web3Utils = new Web3(web3.currentProvider).utils;

contract('Test BazaaarSwapEtherProxyHero_v2', async function(accounts) {

    var contract;
    var test;
    var heroAsset;

    var account1 = accounts[0];
    var account2 = accounts[1];
    var privkey1 = "0x03a0e18510f314e5a0a4f16c2312a40de0711af90b29f1e46974fab7b3a80fba";

    var referralRecipient = accounts[9];
    var artEditRoyaltyRecipient = accounts[8];

    const PRICE = 1000000000;
    const referralRatio = 100;
    const RATIO = 600;

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
        contract =  await bazaaarSwapEtherProxyHero_v2.new();
        test =  await testBazaaarSwapEtherProxyHero_v2.new();
    })

    it('Method: hashOrder', async function() {
        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            proxy: test.address,
            maker: account1,
            taker: "0x0000000000000000000000000000000000000000",
            address: account1,
            asset:heroAsset.address,
            id: HEROID1,
            price: PRICE,
            artEditRoyaltyRatio: RATIO,
            salt: salt
        }

        var data = Web3Utils.soliditySha3(
            order.proxy,
            order.maker,
            order.taker,
            order.address,
            order.asset,
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
            order.salt
        );

        var result = await test.hashOrder_([
            order.proxy,
            order.maker,
            order.taker,
            order.address,
            order.asset,
        ], [
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
            order.salt
        ])

        assert.equal(data, result);
    })

    it('Method: hashToSign', async function() {

        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            proxy: test.address,
            maker: account1,
            taker: "0x0000000000000000000000000000000000000000",
            address: account1,
            asset:heroAsset.address,
            id: HEROID1,
            price: PRICE,
            artEditRoyaltyRatio: RATIO,
            salt: salt
        }

        var data = Web3Utils.soliditySha3(
            order.proxy,
            order.maker,
            order.taker,
            order.address,
            order.asset,
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
            order.salt
        );

        var presignedData = Web3Utils.soliditySha3(
            "\x19Ethereum Signed Message:\n32",
            data
        );

        var result = await test.hashToSign_([
            order.proxy,
            order.maker,
            order.taker,
            order.address,
            order.asset,
        ], [
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
            order.salt
        ])

        assert.equal(presignedData, result);
    })

    it('Method: ecrecover', async function() {

        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            proxy: test.address,
            maker: account1,
            taker: "0x0000000000000000000000000000000000000000",
            address: account1,
            asset:heroAsset.address,
            id: HEROID1,
            price: PRICE,
            artEditRoyaltyRatio: RATIO,
            salt: salt
        }

        var data = Web3Utils.soliditySha3(
            order.proxy,
            order.maker,
            order.taker,
            order.address,
            order.asset,
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
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

    it('Method: validateAssetStatus(HEROID1)', async function() {

        await heroAsset.mint(account1, HEROID1);
        var result = await heroAsset.ownerOf(HEROID1);
        assert.equal(result, account1);

        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            proxy: test.address,
            maker: account1,
            taker: "0x0000000000000000000000000000000000000000",
            address: account1,
            asset:heroAsset.address,
            id: HEROID1,
            price: PRICE,
            artEditRoyaltyRatio: RATIO,
            salt: salt
        }

        var result = await test.validateAssetStatus_([
            order.proxy,
            order.maker,
            order.taker,
            order.address,
            order.asset
        ], [
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
            order.salt
        ])

        assert.equal(false, result, "not approved by maker");

        await heroAsset.approve(test.address, HEROID1);
        var result = await heroAsset.getApproved(HEROID1)
        assert.equal(result, test.address);

        var result = await test.validateAssetStatus_([
            order.proxy,
            order.maker,
            order.taker,
            order.address,
            order.asset
        ], [
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
            order.salt
        ])

        assert.equal(true, result, "approved by maker");

    })

    it('Method: validateOrderParameters', async function() {

        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            proxy: test.address,
            maker: account1,
            taker: "0x0000000000000000000000000000000000000000",
            address: account1,
            asset:heroAsset.address,
            id: HEROID1,
            price: PRICE,
            artEditRoyaltyRatio: RATIO,
            salt: salt
        }

        var result = await test.validateOrderParameters_([
            order.proxy,
            order.maker,
            order.taker,
            order.address,
            order.asset
        ], [
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
            order.salt
        ])

        assert.equal(true, result, "Proxy address: positive");

        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            //Input wrong address
            proxy: contract.address,
            maker: account1,
            taker: "0x0000000000000000000000000000000000000000",
            address: account1,
            asset:heroAsset.address,
            id: HEROID1,
            price: PRICE,
            artEditRoyaltyRatio: RATIO,
            salt: salt
        }

        var result = await test.validateOrderParameters_([
            order.proxy,
            order.maker,
            order.taker,
            order.address,
            order.asset
        ], [
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
            order.salt
        ])

        assert.equal(false, result, "Proxy address: negative");

    })

    it('Method: validateOrder', async function() {

        //!validateAssetStatus(order)
        var result = await heroAsset.getApproved(HEROID1)
        assert.equal(result, test.address);

        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            proxy: test.address,
            maker: account1,
            taker: "0x0000000000000000000000000000000000000000",
            address: account1,
            asset:heroAsset.address,
            id: HEROID1,
            price: PRICE,
            artEditRoyaltyRatio: RATIO,
            salt: salt
        }

        var data = Web3Utils.soliditySha3(
            order.proxy,
            order.maker,
            order.taker,
            order.address,
            order.asset,
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
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
            order.taker,
            order.address,
            order.asset
        ], [
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
            order.salt
        ],
            sig.v,
            sig.r,
            sig.s
        )
        assert.equal(true, result, "maker: positive");

        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            proxy: contract.address,
            //Input wrong address
            maker: account2,
            taker: "0x0000000000000000000000000000000000000000",
            address: account1,
            asset:heroAsset.address,
            id: HEROID1,
            price: PRICE,
            artEditRoyaltyRatio: RATIO,
            salt: salt
        }

        var data = Web3Utils.soliditySha3(
            order.proxy,
            order.maker,
            order.taker,
            order.address,
            order.asset,
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
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
            order.taker,
            order.address,
            order.asset
        ], [
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
            order.salt
        ],
            sig.v,
            sig.r,
            sig.s
        )

        assert.equal(false, result, "maker: negative");

        //!validateOrderParameters(order)
        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            proxy: test.address,
            maker: account1,
            taker: "0x0000000000000000000000000000000000000000",
            address: account1,
            asset:heroAsset.address,
            id: HEROID1,
            price: PRICE,
            artEditRoyaltyRatio: RATIO,
            salt: salt
        }

        var data = Web3Utils.soliditySha3(
            order.proxy,
            order.maker,
            order.taker,
            order.address,
            order.asset,
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
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
            order.taker,
            order.address,
            order.asset
        ], [
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
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
            taker: "0x0000000000000000000000000000000000000000",
            address: account1,
            asset:heroAsset.address,
            id: HEROID1,
            price: PRICE,
            artEditRoyaltyRatio: RATIO,
            salt: salt
        }

        var data = Web3Utils.soliditySha3(
            order.proxy,
            order.maker,
            order.taker,
            order.address,
            order.asset,
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
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
            order.taker,
            order.address,
            order.asset
        ], [
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
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
            taker: "0x0000000000000000000000000000000000000000",
            address: account1,
            asset:heroAsset.address,
            id: HEROID1,
            price: PRICE,
            artEditRoyaltyRatio: RATIO,
            salt: salt
        }

        var data = Web3Utils.soliditySha3(
            order.proxy,
            order.maker,
            order.taker,
            order.address,
            order.asset,
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
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
            order.taker,
            order.address,
            order.asset
        ], [
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
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
            order.taker,
            order.address,
            order.asset
        ], [
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
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
            taker: "0x0000000000000000000000000000000000000000",
            address: account1,
            asset:heroAsset.address,
            id: HEROID1,
            price: PRICE,
            artEditRoyaltyRatio: RATIO,
            salt: salt
        }

        var data = Web3Utils.soliditySha3(
            order.proxy,
            order.maker,
            order.taker,
            order.address,
            order.asset,
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
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
            order.taker,
            order.address,
            order.asset,
        ], [
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
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
            order.taker,
            order.address,
            order.asset,
        ], [
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
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
            taker: "0x0000000000000000000000000000000000000000",
            address: account1,
            asset:heroAsset.address,
            id: HEROID1,
            price: PRICE,
            artEditRoyaltyRatio: RATIO,
            salt: salt
        }

        var data = Web3Utils.soliditySha3(
            order.proxy,
            order.maker,
            order.taker,
            order.address,
            order.asset,
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
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
            order.taker,
            order.address,
            order.asset,
        ], [
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
            order.salt
        ],
            sig.v,
            sig.r,
            sig.s
        )

        assert.equal(presignedData, result);

    })


    it('Method: requireValidOrder', async function() {

        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            proxy: test.address,
            maker: account1,
            taker: "0x0000000000000000000000000000000000000000",
            address: account1,
            asset: heroAsset.address,
            id: HEROID1,
            price: PRICE,
            artEditRoyaltyRatio: RATIO,
            salt: salt
        }

        var data = Web3Utils.soliditySha3(
            order.proxy,
            order.maker,
            order.taker,
            order.address,
            order.asset,
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
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
            order.taker,
            order.address,
            order.asset,
        ], [
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
            order.salt
        ],
            sig.v,
            sig.r,
            sig.s
        )

        assert.equal(presignedData, result);

    })

    it('Method: computeAmount', async function() {

        var salt = Math.floor(Math.random() * 1000000000);
        var price = 10000;

        var order = {
            proxy: test.address,
            maker: account1,
            taker: "0x0000000000000000000000000000000000000000",
            address: account1,
            asset:heroAsset.address,
            id: HEROID1,
            price: price,
            artEditRoyaltyRatio: RATIO,
            salt: salt
        }

        var result = await test.computeAmount_([
            order.proxy,
            order.maker,
            order.taker,
            order.address,
            order.asset,
            referralRecipient
        ], [
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
            order.salt,
            referralRatio
        ]
        )

        assert.equal(9300, result[0].toString());
        assert.equal(600, result[1].toString());
        assert.equal(100, result[2].toString());

    })

    it('Scenario: purchase hero(HEROID9)', async function() {

        await heroAsset.mint(account1, HEROID9);
        var result = await heroAsset.ownerOf(HEROID9);
        assert.equal(result, account1);

        /*
        await heroAsset.approve(contract.address, HEROID9);
        var result = await heroAsset.getApproved(HEROID9)
        assert.equal(result, contract.address);
        */

        await heroAsset.setApprovalForAll(contract.address, true)
        var salt = Math.floor(Math.random() * 1000000000);

        var order = {
            proxy: contract.address,
            maker: account1,
            taker: "0x0000000000000000000000000000000000000000",
            address: artEditRoyaltyRecipient,
            asset:heroAsset.address,
            id: HEROID9,
            price: PRICE,
            artEditRoyaltyRatio: RATIO,
            salt: salt
        }

        var data = Web3Utils.soliditySha3(
            order.proxy,
            order.maker,
            order.taker,
            order.address,
            order.asset,
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
            order.salt
        );

        var sig = web3Eth.accounts.sign(data, privkey1);

        var result = await contract.orderMatch_([
            order.proxy,
            order.maker,
            order.taker,
            order.address,
            order.asset,
            referralRecipient,
        ], [
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
            order.salt,
            referralRatio
        ], sig.v,
           sig.r,
           sig.s,
           { from: account2, value:order.price}
        )

        var result = await heroAsset.ownerOf(HEROID9);
        assert.equal(result, account2);
    })



/*
    it('Method: distribute', async function() {
        var salt = Math.floor(Math.random() * 1000000000);
        var price = 10000;
        var order = {
            proxy: test.address,
            maker: account1,
            address: artEditRoyaltyRecipient,
            id: HEROID1,
            price: price,
            artEditRoyaltyRatio: RATIO,
            salt: salt
        }
        var makerBalanceBefore = await web3.eth.getBalance(account1);
        var takerBalanceBefore = await web3.eth.getBalance(account2);
        var artEditRoyaltyRecipientBalanceBefore = await web3.eth.getBalance(artEditRoyaltyRecipient);
        var assetRoyaltyRecipientBalanceBefore = await web3.eth.getBalance(assetRoyaltyRecipient);
        var referralRecipientBalanceBefore = await web3.eth.getBalance(referralRecipient);
        var result = await test.distribute_([
            order.proxy,
            order.maker,
            order.address,
        ], [
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
            order.salt
        ], referralRecipient,
           {from: account2, value: order.price}
        )
        var makerBalanceAfter = await web3.eth.getBalance(account1);
        var takerBalanceAfter = await web3.eth.getBalance(account2);
        var artEditRoyaltyRecipientBalanceAfter = await web3.eth.getBalance(artEditRoyaltyRecipient);
        var assetRoyaltyRecipientBalanceAfter = await web3.eth.getBalance(assetRoyaltyRecipient);
        var referralRecipientBalanceAfter = await web3.eth.getBalance(referralRecipient);
        console.log(makerBalanceBefore)
        console.log(artEditRoyaltyRecipientBalanceBefore, artEditRoyaltyRecipientBalanceAfter)
        console.log(assetRoyaltyRecipientBalanceBefore, assetRoyaltyRecipientBalanceAfter)
        console.log(referralRecipientBalanceBefore, referralRecipientBalanceAfter)
        //assert.equal(9001 + makerBalanceBefore, makerBalanceAfter, "maker");
        //assert.equal(takerBalanceBefore - order.price, takerBalanceAfter, "taker");
        //assert.equal(100 + referralRecipientBalanceBefore, referralRecipientBalanceAfter, "referralRecipient");
        //assert.equal(600 + artEditRoyaltyRecipientBalanceBefore, artEditRoyaltyRecipientBalanceAfter, "artEditRoyaltyRecipient");
        //assert.equal(150 + referralRecipientBalanceBefore, referralRecipientBalanceAfter, "referralRecipient");
    })
*/

/*
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
            price: PRICE,
            artEditRoyaltyRatio: RATIO,
            salt: salt
        }
        var data = Web3Utils.soliditySha3(
            order.proxy,
            order.maker,
            order.address,
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
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
            order.artEditRoyaltyRatio,
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
            price: PRICE,
            artEditRoyaltyRatio: RATIO,
            salt: salt
        }
        var data = Web3Utils.soliditySha3(
            order.proxy,
            order.maker,
            order.address,
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
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
            order.artEditRoyaltyRatio,
            order.salt
        ], sig.v,
           sig.r,
           sig.s,
           { from: account1 }
        )
        var result = await contract.cancelledOrFinalized(presignedData);
        assert.equal(true, result, "After Order Cancelled");
    })
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
            price: PRICE,
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