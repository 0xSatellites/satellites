const config = require('../config.json');

var express = require('express');
const router = express.Router();

const axios = require('axios')

const admin = require('firebase-admin');
const serviceAccount = require('../.serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var bucket = admin.storage().bucket('blockbase-bazaaar.appspot.com');

var file = "https://www.origin.sand.mch.djty.co/images/heroes/2000/5002.png" // use the Blob or File API

bucket.upload(file).then(function(snapshot) {
  console.log('Uploaded a blob or file!');
});

const Web3 = require('web3');
const web3 = new Web3(config.infura);

const bazaaar = new web3.eth.Contract(config.bazaaarABI, config.bazaaarAddress);

router.post('/set', async function(req, res) {

  const param = req.body;
  var uri = tokenURIPrefix + param.id
  var response = await axios.get(uri)
  var metadata = response.data;
  var date = new Date();
  var time = date.getTime();

  var data = {
    proxy: param.proxy,
    maker: param.maker,
    taker: param.taker,
    artEditRoyaltyRecipient: param.artEditRoyaltyRecipient,
    id: param.id,
    price: param.price,
    artEditRoyaltyRatio: param.artEditRoyaltyRatio,
    salt: param.salt,
    v:param.v,
    r:param.r,
    s:param.s,
    hash:param.hash,
    metadata: metadata,
    status: true,
    timestamp: time,
  };
  orderid = String(param.hash)
  db.collection('order').doc(orderid).set(data);
  res.json({status: true})
});

router.post('/cancel', async function(req, res) {

  const param = req.body;
  console.log(param.hash)

  var orderid = String(param.hash)
  var updateOrder = db.collection("order").doc(orderid);

  // Set the "capital" field of the city 'DC'
  return updateOrder.update({
      status: false
  })
  .then(function() {
      console.log("Document successfully updated!");
  })
  .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  });


});

router.get('/get', async function(req, res) {

    var urlParts = url.parse(req.url, true);
    var parameters = urlParts.query;
    console.log(parameters)
    var id = parameters.id;
    id = String(id)

    var cityRef = db.collection('order').doc(id);
    var getDoc = cityRef.get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          console.log('Document data:', doc.data());
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });
});

router.get('/getAll', async function(req, res) {

  var urlParts = url.parse(req.url, true);
  var parameters = urlParts.query;
  var id = parameters.id;

  db.collection('order').get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
    });
  })
  .catch((err) => {
    console.log('Error getting documents', err);
  });

});

module.exports = router;