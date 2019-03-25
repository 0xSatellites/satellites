const axios = require('axios')
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

exports.myTokens = functions
.https.onRequest(async (req, res) => {
    var result = await axios.get("https://api.crypt-oink.io/tokens_of?"+ req.query.address)
    res.json(result.data)
  });
