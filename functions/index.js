const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./.serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore()
const fs = require('fs')

exports.ogp = functions.region('asia-northeast1').https.onRequest((req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600')
  const path = req.path.split('/')
  const order = path[2]
  fs.readFile('../app/dist/index.html', 'utf8', function (err, html){
    db.collection('order').doc(order).get().then((doc) => {
    const data = doc.data()
      const responseHTML = html
        .replace(html.match(
          `<meta data-n-head="true" data-hid="og:image" property="og:image" content="">`),
          `<meta data-n-head="true" data-hid="og:image" property="og:image" content="${data.ogp}">`)
      res.status(200).end(responseHTML)
    }).catch(err => {
      res.status(500).end(err)
    })
  })
});
