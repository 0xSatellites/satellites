const admin = require('firebase-admin')
const serviceAccount = require('../.serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const UUID = require("uuid-v4");
const uuid = UUID();

admin.auth().createCustomToken('0xB1A25D6E37ad12579801eBb6787636fd63ba87cc')
.then(function(customToken) {
    console.log(customToken)
})
.catch(function(error) {
    console.log("Error creating custom token:", error);
});

