const config = require('../../config.json')

const express = require('express')
const router = express.Router()

const admin = require('firebase-admin')
const db = admin.firestore()

const Web3 = require('web3');
const web3 = new Web3(config.node.wss)

const contract = {
    bazaaar_v1:new web3.eth.Contract(config.abi.bazaaar.proxy_v1, config.contract.bazaaar.proxy_v1)
}

contract.bazaaar_v1.events.OrderCancelled(null, async function(error, result) {
    if (error) return
    const date = new Date()
    const time = date.getTime()
    const key = result.returnValues.hash
    const doc = await db.collection('order').doc(key).get()
    const order = doc.data()
    order.status = 'cancelled'
    order.modified = time
    db.collection('order').doc(key).set(order)
});

contract.bazaaar_v1.events.OrderMatched(null, async function(error, result) {
    if (error) return
    const date = new Date()
    const time = date.getTime()
    const key = result.returnValues.hash;
    const doc = await db.collection('order').doc(key).get();
    const order = doc.data();
    order.status = 'matched';
    order.modified = time
    db.collection('order').doc(key).set(order);
});

module.exports = router;