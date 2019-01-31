const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./.serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore()

exports.auth = functions.region('asia-northeast1').https.onRequest((req, res) => {

});
