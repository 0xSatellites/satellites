const config = require('../config.json');

const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
const serviceAccount = require('../.serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

const db = admin.firestore();

const Web3 = require('web3');

const web3ws = new Web3(config.infuraws);
const contract = new web3ws.eth.Contract(config.bazaaarABI, config.bazaaarAddress);

contract.events.OrderCancelled(null, async function(error, result) {
    if (error) return
    const hash = result.returnValues.hash;
    const doc = await db.collection('order').doc(hash).get();
    const order = doc.data();
    order.status = false;
    db.collection('order').doc(hash).set(order);
});

contract.events.OrderMatched(null, async function(error, result) {
    if (error) return
    const hash = result.returnValues.hash;
    const doc = await db.collection('order').doc(hash).get();
    const order = doc.data();
    order.status = false;
    db.collection('order').doc(hash).set(order);
});

module.exports = router;