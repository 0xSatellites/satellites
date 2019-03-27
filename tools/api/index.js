const axios = require('axios')
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

exports.getOinksByAddress = functions
.https.onRequest(async (req, res) =>{
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type, authorization');
    var result = await axios.get("https://api.crypt-oink.io/tokens_of?"+ req.query.address)

    const promises = []
    for (var i = 0; i < result.data.length; i++) {
        promises.push(axios.get('https://api.crypt-oink.io/metadata?'+ result.data[i]))
      }
     tokens = await Promise.all(promises)
     console.log(tokens)
     const data =[]
     for (var i = 0; i < tokens.length; i++) {
         tokens[i].data.id = result.data[i]
        data.push(tokens[i].data)
      }
    res.json(data)
  });

  exports.getOinkById = functions
.https.onRequest(async (req, res) =>{
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type, authorization');
    var result = await axios.get("https://api.crypt-oink.io/metadata?"+ req.query.id)
    res.json(result.data)
  });