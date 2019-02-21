const config = require('./config.json')

const functions = require('firebase-functions')
const admin = require('firebase-admin')

<<<<<<< HEAD
const project = process.env.GCLOUD_PROJECT.split('-')[2]
=======
const project = functions.config().env.project || 'development'
>>>>>>> 3a858e0e37ee206406c411b9fff0b0a4796bb47a

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
})

const db = admin.firestore()
const settings = {timestampsInSnapshots: true};
db.settings(settings);

const bucket = admin.storage().bucket(config.bucket[project])

const axios = require("axios")

const {promisify} = require('util')
const fs = require('fs')
const readFile = promisify(fs.readFile)

const Canvas = require('canvas')
Canvas.registerFont(__dirname  + '/assets/fonts/NotoSansJP-Regular.otf', { family: 'Noto Sans JP' })
Canvas.registerFont(__dirname  + '/assets/fonts/NotoSansJP-Bold.otf', { family: 'Noto Sans JP Bold', weight: 'bold'})

const Web3 = require('web3')
const web3 = new Web3(config.node[project].https)
const bazaaar_v1 = new web3.eth.Contract(
  config.abi.bazaaar_v1,
  config.contract[project].bazaaar_v1
)

exports.order = functions.region('asia-northeast1').https.onCall(async (params, context) => {
<<<<<<< HEAD
=======
  console.log("test!!!!!")
>>>>>>> 3a858e0e37ee206406c411b9fff0b0a4796bb47a
  const data = params.order
  const hash = await bazaaar_v1.methods
    .requireValidOrder_(
      [data.proxy, data.maker, data.taker, data.creatorRoyaltyRecipient, data.asset],
      [data.id, data.price, data.nonce, data.salt, data.expiration, data.creatorRoyaltyRatio, data.referralRatio],
      data.v,
      data.r,
      data.s
    )
    .call()

  const response = await axios({method:'get', url:config.api.ck.metadata + data.id, responseType:'json'})
  const metadata = response.data

  const canvas = Canvas.createCanvas(1200,630)
  const c = canvas.getContext('2d')

  const imagePromise = axios.get(metadata.image_url_png, { responseType: 'arraybuffer' })

  promises = [
    readFile('./assets/img/bg.png'),
    readFile('./assets/img/logo.png'),
    readFile('./assets/img/btn.png'),
    readFile('./assets/img/out.png'),
    imagePromise,
  ]

  const resolved = await Promise.all(promises)

  const bgImg = new Canvas.Image()
  bgImg.src = resolved[0]

  const logoImg = new Canvas.Image()
  logoImg.src = resolved[1]

  const btnImg = new Canvas.Image()
  btnImg.src = resolved[2]

  const outImg = new Canvas.Image()
  outImg.src = resolved[3]

  const characterImg = new Canvas.Image()
  characterImg.src = resolved[4].data

  c.clearRect(0, 0, 1200, 630)
  c.drawImage(bgImg, 0, 0)
  c.drawImage(logoImg, 1002, 21)
  c.drawImage(btnImg, 696, 489)
  c.drawImage(characterImg, 15, 90, 450, 450)

  c.fillStyle = '#ffff00'
  c.font = "bold 60px 'Noto Sans JP'"
  c.textBaseline = "top"
  c.textAlign = 'center'
  if(!params.msg){
    c.fillText('NOW ON SALE!', 840, 120, 720)
  } else {
    var msg = params.msg.replace(/\r?\n/g, '')
    c.fillText(msg.substr(0,9), 840, 80, 720)

    c.fillStyle = '#ffff00'
    c.font = "bold 60px 'Noto Sans JP'"
    c.textBaseline = "top"
    c.textAlign = 'center'
    c.fillText(msg.substr(9,18), 840, 160, 720)
  }

  c.fillStyle = '#fff'
  c.font = "40px 'Noto Sans JP'"
  c.textBaseline = "top"
  c.textAlign = 'center'
  c.fillText('Id.' + data.id + '/' + 'Gen.' + metadata.generation, 840, 255, 720)

  c.fillStyle = '#fff'
  c.font = "40px 'Noto Sans JP'"
  c.textBaseline = "top"
  c.textAlign = 'center'
  c.fillText('Cooldown.' + metadata.status.cooldown_index, 840, 305, 720)

  c.fillStyle = '#fff'
  c.font = "bold 75px 'Noto Sans JP Bold'"
  c.textBaseline = "top"
  c.textAlign = 'center'
  c.fillText(web3.utils.fromWei(data.price) + ' ETH', 840, 375, 720)

  const base64EncodedImageString = canvas.toDataURL().substring(22)
  const imageBuffer = Buffer.from(base64EncodedImageString, 'base64')
  const file = bucket.file(hash + '.png')
  file.save(imageBuffer, { metadata: {contentType: 'image/png'}})

  const ogp = 'https://firebasestorage.googleapis.com/v0/b/' + bucket.name + '/o/' + encodeURIComponent(hash + '.png') + '?alt=media'
  const now = new Date().getTime()
  data.hash = hash
  data.metadata = metadata
  data.ogp = ogp
  data.created = now
  data.valid = true

  const batch = db.batch()

  const snapshots = await db.collection('order')
  .where("maker", "==", data.maker)
  .where("asset", "==", data.asset)
  .where("id", "==", data.id)
  .where("valid", "==", true)
  .get()

  snapshots.forEach(function(doc) {
    const ref = db.collection('order').doc(doc.id)
    batch.update(ref, {result: {status:'cancelled'}, valid:false, modified:now})
  })

  const ref = db.collection('order').doc(hash)
  batch.set(ref, data)

  await batch.commit()

  const result = {
    ogp:ogp,
    hash:hash
  }

  return result

})

exports.onOrderChange = functions.firestore.document('order/{hash}').onUpdate(async (change, context) => {

    const doc = change.after.data()
    const canvas = Canvas.createCanvas(1200,630)
    const c = canvas.getContext('2d')

    const imagePromise = axios.get(doc.ogp, { responseType: 'arraybuffer' })

    promises = [
      imagePromise,
      readFile('./assets/img/out_en.png'),
    ]

    const resolved = await Promise.all(promises)

    const bgImg = new Canvas.Image()
    bgImg.src = resolved[0].data
    const outImg = new Canvas.Image()
    outImg.src = resolved[1]

    c.clearRect(0, 0, 1200, 630)
    c.drawImage(bgImg, 0, 0)

    c.fillStyle = 'rgba(0,0,0,0.7)';
    c.fillRect(0,0,1200,630);
    c.drawImage(outImg, 76, 145);

    const base64EncodedImageString = canvas.toDataURL().substring(22)
    const imageBuffer = Buffer.from(base64EncodedImageString, 'base64')
    const file = bucket.file(change.after.id + '.png')
    file.save(imageBuffer, { metadata: {contentType: 'image/png'}})
});

//そのアセットの今Matched履歴以外を全てCancelled状態にする。一つのみMatched。
exports.orderMatchedPubSub = functions.region('asia-northeast1').pubsub.topic('orderMatched').onPublish(async message => {
  const transactionHash = message.json.transactionHash
  const transaction = await web3.eth.getTransactionReceipt(transactionHash)

  const hash = transaction.logs[0].topics[1]
  const address = web3.utils.toChecksumAddress(transaction.logs[0].address)
  const maker = web3.utils.toChecksumAddress(web3.utils.toHex(transaction.logs[0].data.substring(26, 66)))
  const taker = web3.utils.toChecksumAddress(web3.utils.toHex(transaction.logs[0].data.substring(90, 130)))
  const asset = web3.utils.toChecksumAddress(web3.utils.toHex(transaction.logs[0].data.substring(154, 194)))
  const id = web3.utils.hexToNumber(transaction.logs[0].data.substring(194, 258)).toString()
  const now = new Date().getTime()

  if(address == config.contract.rinkeby.bazaaar_v1){
    const batch = db.batch()
    var ref = db.collection('order').doc(hash)
    batch.update(ref, {result: {status:'sold', taker:taker}, valid:false, modified:now})
    const snapshots = await db.collection('order')
    .where("maker", "==", maker)
    .where("asset", "==", asset)
    .where("id", "==", id)
    .where("valid", "==", true)
    .get()
    snapshots.forEach(function(doc) {
      if(doc.id != hash){
        var ref = db.collection('order').doc(doc.id)
        batch.update(ref, {result: {status:'cancelled'}, valid:false, modified:now})
      }
    })
    await batch.commit()
  }
})

//そのアセットの履歴を全てCancelled状態にする事でキャンセルとする
exports.orderCancelledPubSub = functions.region('asia-northeast1').pubsub.topic('orderCancelled').onPublish(async message => {
  const transactionHash = message.json.transactionHash
  const transaction = await web3.eth.getTransactionReceipt(transactionHash)

  const address = web3.utils.toChecksumAddress(transaction.logs[0].address)
  const maker = web3.utils.toChecksumAddress(web3.utils.toHex(transaction.logs[0].data.substring(26, 66)))
  const asset = web3.utils.toChecksumAddress(web3.utils.toHex(transaction.logs[0].data.substring(90, 130)))
  const id = web3.utils.hexToNumber(transaction.logs[0].data.substring(130, 194)).toString()
  const now = new Date().getTime()

  if(address == config.contract.rinkeby.bazaaar_v1){
    const batch = db.batch()
    const snapshots = await db.collection('order')
    .where("maker", "==", maker)
    .where("asset", "==", asset)
    .where("id", "==", id)
    .where("valid", "==", true)
    .get()
    snapshots.forEach(function(doc) {
      var ref = db.collection('order').doc(doc.id)
      batch.update(ref, {result: {status:'cancelled'}, valid:false, modified:now})
    })
    await batch.commit()
  }
})


exports.orderPeriodicUpdatePubSub = functions.region('asia-northeast1').pubsub.topic('orderPeriodicUpdate').onPublish(async message => {
  const eventOrderMatchedAll = await bazaaar_v1.getPastEvents('OrderMatched', {
    fromBlock: await web3.eth.getBlockNumber() - 150,
    toBlock: 'latest'
  })

  const eventOrderCancelledAll = await bazaaar_v1.getPastEvents('orderCancelled', {
    fromBlock: await web3.eth.getBlockNumber() - 150,
    toBlock: 'latest'
  })

  const batch = db.batch()

  for(var OrderMatched of eventOrderMatchedAll) {
    var hash = OrderMatched.returnValues.hash
    var id = OrderMatched.returnValues.id
    var maker = OrderMatched.returnValues.maker
    var taker = OrderMatched.returnValues.taker
    var asset = OrderMatched.returnValues.asset

    var snapshots = await db.collection('order')
      .where("hash", "==", hash)
      .where("valid", "==", true)
      .get()

    snapshots.forEach(function(doc) {
      var ref = db.collection('order').doc(doc.id)
      batch.update(ref, {result: {status:'sold', taker:taker}, valid:false, modified:now})
    })

    var snapshots = await db.collection('order')
      .where("id", "==", id)
      .where("maker", "==", maker)
      .where("asset", "==", asset)
      .where("valid", "==", true)
      .get()

    snapshots.forEach(function(doc) {
      var ref = db.collection('order').doc(doc.id)
      batch.update(ref, {result: {status:'cancelled'}, valid:false, modified:now})
    })

  }

  for(var orderCancelled of eventOrderCancelledAll) {
    var hash = orderCancelled.returnValues.hash
    var id = orderCancelled.returnValues.id
    var maker = orderCancelled.returnValues.maker
    var taker = orderCancelled.returnValues.taker
    var asset = orderCancelled.returnValues.asset

    var snapshots = await db.collection('order')
      .where("id", "==", id)
      .where("maker", "==", maker)
      .where("asset", "==", asset)
      .where("valid", "==", true)
      .get()

    snapshots.forEach(function(doc) {
      var ref = db.collection('order').doc(doc.id)
      batch.update(ref, {result: {status:'cancelled'}, valid:false, modified:now})
    })

  }
  await batch.commit()
})