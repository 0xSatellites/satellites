const config = require('./config.json')
//const serviceAccount = require('./.serviceAccountKey.json')

const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
})

const db = admin.firestore()
const bucket = admin.storage().bucket(config.bucket.sand);

const axios = require("axios")

const {promisify} = require('util')
const fs = require('fs')
const readFile = promisify(fs.readFile)

const Canvas = require('canvas')
Canvas.registerFont(__dirname  + '/assets/fonts/NotoSansJP-Regular.otf', { family: 'Noto Sans JP' })
Canvas.registerFont(__dirname  + '/assets/fonts/NotoSansJP-Bold.otf', { family: 'Noto Sans JP Bold', weight: 'bold'})

const Web3 = require('web3')
const web3 = new Web3(config.node.rinkeby.https)
const bazaaar_v1 = new web3.eth.Contract(
  config.abi.bazaaar_v1,
  config.contract.rinkeby.bazaaar_v1
)

async function metadata(asset, id){

  var response
  if(asset == 'mchh') {
    let general = await axios({
      method:'get',
      url:config.api.mch.metadata + 'hero/' + id,
      responseType:'json'
    })

    let promises = []
    promises.push(axios({
      method:'get',
      url:config.api.mch.metadata + 'heroType/'+ general.data.extra_data.hero_type,
      responseType:'json'
    }))

    promises.push(axios({
      method:'get',
      url:config.api.mch.metadata + 'skill/' + general.data.extra_data.active_skill_id,
      responseType:'json'
    }))

    promises.push(axios({
      method:'get',
      url:config.api.mch.metadata + 'skill/' + general.data.extra_data.passive_skill_id,
      responseType:'json'
    }))

    let resolved = await Promise.all(promises)

    response = general.data
    response.hero_type = resolved[0].data
    response.active_skill = resolved[1].data
    response.passive_skill = resolved[2].data
  } else if (asset == 'mche'){
    let general = await axios({
      method:'get',
      url:config.api.mch.metadata + 'extension/' + id,
      responseType:'json'
    })

    let promises = []
    promises.push(axios({
      method:'get',
      url:config.api.mch.metadata + 'extensionType/'+ general.data.extra_data.extension_type,
      responseType:'json'
    }))

    promises.push(axios({
      method:'get',
      url:config.api.mch.metadata + 'skill/' + general.data.extra_data.skill_id,
      responseType:'json'
    }))

    let resolved = await Promise.all(promises)

    response = general.data
    response.extension_type = resolved[0].data
    response.skill = resolved[1].data
  }else if (asset == 'ck'){
    let general = await axios({
      method:'get',
      url:config.api.ck.metadata + id,
      responseType:'json'
    })

    response = general.data
  }
  return response
}

exports.metadata = functions.region('asia-northeast1').https.onCall(async (data, context) => {
  return await metadata(data.asset, data.id)
})

exports.order = functions.region('asia-northeast1').https.onCall(async (data, context) => {
  console.log(1)
  const hash = await bazaaar_v1.methods
    .requireValidOrder_(
      [data.proxy, data.maker, data.taker, data.creatorRoyaltyRecipient, data.asset],
      [data.id, data.price, data.nonce, data.salt, data.expiration, data.creatorRoyaltyRatio, data.referralRatio],
      data.v,
      data.r,
      data.s
    )
    .call()

  console.log(2)
  data.metadata = await metadata('ck', data.order.id)
  let canvas = Canvas.createCanvas(1200,630)
  let c = canvas.getContext('2d')

  promises = [
    readFile('./assets/img/bg.png'),
    readFile('./assets/img/logo.png'),
    readFile('./assets/img/btn.png'),
    readFile('./assets/img/out.png'),
    axios.get(
      data.metadata.image_url_png,
      { responseType: 'arraybuffer' }),
    // metadata('ck', data.id)
  ]

  let resolved = await Promise.all(promises)

  //背景画像
  let bgImg = new Canvas.Image()
  bgImg.src = resolved[0]

  //ロゴ
  let logoImg = new Canvas.Image()
  logoImg.src = resolved[1]

  //ボタン
  let btnImg = new Canvas.Image()
  btnImg.src = resolved[2]

  let outImg = new Canvas.Image();
  outImg.src = resolved[3]

  //キャラクター画像
  let characterImg = new Canvas.Image();
  characterImg.src = resolved[4].data
  console.log(resolved[4].data)


  //初期化
  c.clearRect(0, 0, 1200, 630);

  //背景画像
  c.drawImage(bgImg, 0, 0);

  //ロゴ
  c.drawImage(logoImg, 1002, 21);

  //ボタン
  c.drawImage(btnImg, 696, 489);

  //キャラクター画像
  c.drawImage(characterImg, 15, 90, 450, 450);

  //コメント 単一行
  c.fillStyle = '#ffff00';
  c.font = "bold 80px 'Noto Sans JP Bold'";
  c.textBaseline = "top";
  c.textAlign = 'center';
  c.fillText(data.msg, 840, 120, 720);

  //コメント 1行目
  //c.fillStyle = '#ffff00';
  //c.font = "bold 64px 'Noto Sans JP'";
  //c.textBaseline = "top";
  //c.textAlign = 'center';
  //c.fillText('テキスト可変の場合', 840, 80, 720);

  //コメント 2行目
  //c.fillStyle = '#ffff00';
  //c.font = "bold 64px 'Noto Sans JP'";
  //c.textBaseline = "top";
  //c.textAlign = 'center';
  //c.fillText('最大18文字まで可能', 840, 160, 720);

  //名前
  c.fillStyle = '#fff';
  c.font = "40px 'Noto Sans JP'";
  c.textBaseline = "top";
  c.textAlign = 'center';
  c.fillText('Id.' +data.metadata.id, 840, 235, 720);

  //Gen
  c.fillStyle = '#fff';
  c.font = "40px 'Noto Sans JP'";
  c.textBaseline = "top";
  c.textAlign = 'center';
  c.fillText('Gen.' + data.metadata.generation, 840, 285, 720);

  //cooldown
  c.fillStyle = '#fff';
  c.font = "40px 'Noto Sans JP'";
  c.textBaseline = "top";
  c.textAlign = 'center';
  c.fillText('Cooldown.' + data.metadata.status.cooldown_index, 840, 335, 720);
  console.log(data.order.price)
  //イーサ
  c.fillStyle = '#fff';
  c.font = "bold 75px 'Noto Sans JP Bold'";
  c.textBaseline = "top";
  c.textAlign = 'center';
  c.fillText(web3.utils.fromWei(data.order.price) + ' ETH', 840, 375, 720);

  console.log(3)

  const base64EncodedImageString = canvas.toDataURL().substring(22)
  const imageBuffer = Buffer.from(base64EncodedImageString, 'base64')
  const file = bucket.file(hash + '.png')
  file.save(imageBuffer, {
    metadata: {
      contentType: 'image/png'
    }
  })

  const ogp = 'https://firebasestorage.googleapis.com/v0/b/' + bucket.name + '/o/' + encodeURIComponent(hash + '.png') + '?alt=media'
  data.timestamp = new Date().getTime()
  data.valid = true
  data.status = '出品中'
  data.hash = hash
  data.ogp = ogp

  await db.collection('order').doc(hash).set(data)

  const result = {
    ogp:ogp,
    hash:hash
  }

  return result

});

exports.orderMatchedPubSub = functions.region('asia-northeast1').pubsub.topic('orderMatched').onPublish(message => {
  const transactionHash = message.json.transactionHash;
  web3.eth.getTransactionReceipt(transactionHash)
  .then(async function(val){
    const maker = web3.utils.toChecksumAddress(web3.utils.toHex(val.logs[0].data.substring(26, 66)))
    const asset = web3.utils.toChecksumAddress(web3.utils.toHex(val.logs[0].data.substring(90, 130)))
    const id = web3.utils.hexToNumber(val.logs[0].data.substring(130, 194)).toString()
    const time = new Date().getTime()
    if(web3.utils.toChecksumAddress(val.logs[0].address) == config.contract.rinkeby.bazaaar_v1){
      const batch = db.batch();
      var ref = db.collection('order').doc(val.logs[0].topics[1])
      batch.update(ref, {status:'売却済', valid:false, timestamp:time})
      const snapshots = await db.collection('order')
      .where("maker", "==", maker)
      .where("asset", "==", asset)
      .where("id", "==", id)
      .get()
      snapshots.forEach(function(doc) {
        if(doc.id != val.logs[0].topics[1]){
          var ref = db.collection('order').doc(doc.id)
          batch.update(ref, {status:'キャンセル', valid:false, timestamp:time})
        }
      })
      batch.commit().then(function () {
        console.log("done!!")
      });
    }
  })
});

exports.orderCancelledPubSub = functions.region('asia-northeast1').pubsub.topic('orderCancelled').onPublish(message => {
  const transactionHash = message.json.transactionHash;
  web3.eth.getTransactionReceipt(transactionHash)
  .then(async function(val){
    const maker = web3.utils.toChecksumAddress(web3.utils.toHex(val.logs[0].data.substring(26, 66)))
    const asset = web3.utils.toChecksumAddress(web3.utils.toHex(val.logs[0].data.substring(90, 130)))
    const id = web3.utils.hexToNumber(val.logs[0].data.substring(130, 194)).toString()
    const time = new Date().getTime()
    if(web3.utils.toChecksumAddress(val.logs[0].address) == config.contract.rinkeby.bazaaar_v1){
      const batch = db.batch();
      const snapshots = await db.collection('order')
      .where("maker", "==", maker)
      .where("asset", "==", asset)
      .where("id", "==", id)
      .get()
      snapshots.forEach(function(doc) {
        var ref = db.collection('order').doc(doc.id)
        batch.update(ref, {status:'キャンセル', valid:false, timestamp:time})
      })
      batch.commit().then(function () {
        console.log("done!!")
      });
    }
  })
});
