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

    var templateNonce = 0
    var templateSalt = Math.floor(Math.random() * 1000000000);
    var date = new Date()
    date.setDate(date.getDate() + 7)
    var templateExpiration = Math.round(date.getTime() / 1000)
    var templateOrder

    var account1 = accounts[0];
    var account2 = accounts[1];
    var privkey1 = "0x59e6a1fa28851d9b11fef9967d4d63c50a40adbd8e944b67ad1f00f5ff614c24";

    var referralRecipient = accounts[9];
    var artEditRoyaltyRecipient = accounts[8];

    const PRICE = 10000;
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

    const hash = (order) => {
        return  Web3Utils.soliditySha3(
            order.proxy,
            order.maker,
            order.taker,
            order.address,
            order.asset,
            order.id,
            order.price,
            order.nonce,
            order.salt,
            order.expiration,
            order.artEditRoyaltyRatio,
            order.referralRatio
        );
    }

    const preSigned = (data) => {
        return Web3Utils.soliditySha3(
            "\x19Ethereum Signed Message:\n32",
            data
        );
    }

    const input = (order) => {
        return [[
            order.proxy,
            order.maker,
            order.taker,
            order.address,
            order.asset,
        ], [
            order.id,
            order.price,
            order.nonce,
            order.salt,
            order.expiration,
            order.artEditRoyaltyRatio,
            order.referralRatio
        ]]
    }

    const referral = (order,referral) => {
        return [[
            order.proxy,
            order.maker,
            order.taker,
            order.address,
            order.asset,
            referral
        ], [
            order.id,
            order.price,
            order.nonce,
            order.salt,
            order.expiration,
            order.artEditRoyaltyRatio,
            order.referralRatio
        ]]
    }

    it('Setup', async function() {
        heroAsset = await HeroAsset.new();
        contract =  await bazaaarSwapEtherProxyHero_v2.new();
        test =  await testBazaaarSwapEtherProxyHero_v2.new();

        templateOrder = {
            proxy: test.address,
            maker: account1,
            taker: "0x0000000000000000000000000000000000000000",
            address: account1,
            asset:heroAsset.address,
            id: HEROID1,
            price: PRICE,
            nonce: templateNonce,
            salt: templateSalt,
            expiration: templateExpiration,
            artEditRoyaltyRatio: RATIO,
            referralRatio: referralRatio
        }

    })

    it('Method: hashOrder', async function() {
        var order = templateOrder
        var data = hash(order)
        var result = await test.hashOrder_(input(order)[0], input(order)[1])
        assert.equal(data, result);
    })

    it('Method: hashToSign', async function() {
        var order = templateOrder
        var data = hash(order)
        var presignedData = preSigned(data)
        var result = await test.hashToSign_(input(order)[0], input(order)[1])
        assert.equal(presignedData, result);
    })

    it('Method: ecrecover', async function() {
        var order = templateOrder
        var data = hash(order)
        var presignedData = preSigned(data)
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

        var order = templateOrder
        var result = await test.validateAssetStatus_(input(order)[0], input(order)[1])
        assert.equal(false, result, "not approved by maker");

        await heroAsset.approve(test.address, HEROID1);
        var result = await heroAsset.getApproved(HEROID1)
        assert.equal(result, test.address);

        var result = await test.validateAssetStatus_(input(order)[0], input(order)[1])
        assert.equal(true, result, "approved by maker");
    })

    it('Method: validateOrderParameters', async function() {
        var order = templateOrder
        var result = await test.validateOrderParameters_(input(order)[0], input(order)[1])
        assert.equal(true, result, "Should pass: positive")

        //order.proxy != address(this)
        var keep = order.proxy
        order.proxy = contract.address
        var result = await test.validateOrderParameters_(input(order)[0], input(order)[1])
        assert.equal(false, result, "Proxy address: negative")
        order.proxy = keep

        //order.expiration < now
        var keep = order.expiration
        var date = new Date()
        date.setDate(date.getDate() - 1)
        var Expired = Math.round(date.getTime() / 1000)
        order.expiration = Expired
        var result = await test.validateOrderParameters_(input(order)[0], input(order)[1])
        assert.equal(false, result, "Expiration: negative")
        order.expiration = keep

        //order.nonce != nonce[order.maker][order.asset][order.id]
        var keep = order.nonce
        order.nonce = 1
        var result = await test.validateOrderParameters_(input(order)[0], input(order)[1])
        assert.equal(false, result, "nonce: negative")
        order.nonce = keep
    })

    it('Method: validateOrder', async function() {
        var result = await heroAsset.getApproved(HEROID1)
        assert.equal(result, test.address);
        var order = templateOrder
        var data = hash(order)
        var presignedData = preSigned(data)
        var sig = web3Eth.accounts.sign(data, privkey1);
        var result = await test.validateOrder_(presignedData, input(order)[0], input(order)[1], sig.v, sig.r, sig.s)
        assert.equal(true, result);

        //!validateAssetStatus(order)

        //!validateOrderParameters(order)

        //ecrecover(hash, sig.v, sig.r, sig.s) == order.maker)
    })

    it('Method: requireValidOrder', async function() {
        var result = await heroAsset.getApproved(HEROID1)
        assert.equal(result, test.address);
        var order = templateOrder
        var data = hash(order)
        var presignedData = preSigned(data)
        var sig = web3Eth.accounts.sign(data, privkey1);
        var result = await test.requireValidOrder_(input(order)[0], input(order)[1], sig.v, sig.r, sig.s)
        assert.equal(presignedData, result);
    })

    it('Method: computeAmount', async function() {
        var order = templateOrder

        var result = await test.computeAmount_(referral(order, referralRecipient)[0], input(order)[1])
        assert.equal(9300, result[0].toString());
        assert.equal(600, result[1].toString());
        assert.equal(100, result[2].toString());
    })

    it('Scenario: purchase hero(HEROID9)', async function() {

        await heroAsset.mint(account1, HEROID9);
        var result = await heroAsset.ownerOf(HEROID9);
        assert.equal(result, account1);

        await heroAsset.setApprovalForAll(contract.address, true)

        var order = templateOrder
        order.id = HEROID9
        order.proxy = contract.address
        var data = hash(order)
        var sig = web3Eth.accounts.sign(data, privkey1);

        var result = await contract.orderMatch_(referral(
            order,
            referralRecipient)[0],
            input(order)[1],
            sig.v,
            sig.r,
            sig.s,
            { from: account2, value:order.price}
        )

        var result = await heroAsset.ownerOf(HEROID9);
        assert.equal(result, account2);
    })
})