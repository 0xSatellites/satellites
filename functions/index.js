const functions = require('firebase-functions');
const admin = require('firebase-admin');

const serviceAccount = require('../.serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore()

exports.order = functions.https.onRequest((req, res) => {
  const path = req.path.split('/')
  const order = path[2]
  console.log()
  db.collection('order').doc(order).get().then((doc) => {
    console.log(doc.data())
    //res.status(200).end(doc.data())
  }).catch(err => {
    console.log(err)
    //res.status(500).end(err)
  })
});