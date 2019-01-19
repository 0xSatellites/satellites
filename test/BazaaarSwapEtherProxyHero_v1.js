var bazaaarSwapEtherProxyHero_v1 = artifacts.require('BazaaarSwapEtherProxyHero_v1')

var Web3 = require('web3');

const web3Eth = new Web3(web3.currentProvider).eth;
const Web3Utils = new Web3(web3.currentProvider).utils;
const Web3Personal = new Web3(web3.currentProvider).personal ;

contract('Test BazaaarSwapEtherProxyHero_v1', async function(accounts) {
  
    it('Signature recovery', async function() {
        var contract = await bazaaarSwapEtherProxyHero_v1.deployed();

        var order = {
            proxy: contract.address,
            maker: "0x74b0edfbb5698ad379a7b4592c3993b4857b59d6",
            taker: "0x74b0edfbb5698ad379a7b4592c3993b4857b59d6", 
            address: "0x74b0edfbb5698ad379a7b4592c3993b4857b59d6",
            id: 10,
            price: 1000,
            salt: 1000            
        }

        var data = Web3Utils.soliditySha3(
            order.proxy, 
            order.maker, 
            order.taker, 
            order.address, 
            order.id, 
            order.price, 
            order.salt
        );

        var sig = web3Eth.accounts.sign(data, "0xddff83537c186192c39d7db961a606096592792e3b1daeeae490eb5e3b9e2186");

        var result = await contract.orderMatch_([
            order.maker, 
            order.taker, 
            order.address, 
        ], [
            order.id, 
            order.price, 
            order.salt
        ], sig.v,
           sig.r,
           sig.s
        )

        console.log(result.logs)

    })
})