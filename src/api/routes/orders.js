var express = require('express');
var bodyParser = require('body-parser');
const router = express.Router();
var url = require('url');
const admin = require('firebase-admin');
var serviceAccount = require('../.serviceAccountKey.json');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();

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

router.post('/set', async function(req, res) {
  
    const param = req.body;
    console.log(param)
    
    var date = new Date();
    var time = date.getTime();

    var data = {
        orderid: param.order,
        contract: param.contract,
        id: param.id,
        price: param.price,
        sig: param.sig,
        metadata: param.metadata,
        flag: param.flag,
        timestamp: time,
      };
      console.log(data)
      orderid = String(param.order)
      
      var setDoc = db.collection('order').doc(orderid).set(data);

});

module.exports = router;