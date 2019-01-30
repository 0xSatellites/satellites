const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('../.serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore()
const fs = require('fs')

exports.ogp = functions.https.onRequest((req, res) => {
  const path = req.path.split('/')
  const order = path[2]
  db.collection('order').doc(order).get().then((doc) => {
    const data = doc.data()
    fs.readFile('../app/dist/index.html', 'utf8', function (err, templateHtml){
      const responseHTML = templateHtml
        .replace(templateHtml.match(
          /<meta data-n-head="true" data-hid="og:image" property="og:image" content="">/),
          `<meta data-n-head="true" data-hid="og:image" property="og:image" content="${data.ogp}">`)

      res.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
      res.status(200).end(responseHTML)
    }).catch(err => {
      console.log(err)
      //res.status(500).end(err)
    })
  })
});