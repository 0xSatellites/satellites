const functions = require('firebase-functions');
const admin = require('firebase-admin');
const draw = require('./lib/canvas')
const serviceAccount = require('./.serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore()

exports.order = functions.region('asia-northeast1').https.onRequest((req, res) => {
  const param = req.body
  const image = draw('', 'start', '')
  //console.log(result.toDataURL())

});
