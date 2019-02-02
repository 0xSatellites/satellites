const config = require('./config.json')
const serviceAccount = require('./.serviceAccountKey.json')

const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
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
const bazaaar_v2 = new web3.eth.Contract(
  config.abi.bazaaar_v2,
  config.contract.rinkeby.bazaaar_v2
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
  }
  return response
}

exports.metadata = functions.region('asia-northeast1').https.onCall(async (data, context) => {
  return await metadata(data.asset, data.id)
})

exports.order = functions.region('asia-northeast1').https.onCall(async (data, context) => {

  const hash = await bazaaar_v2.methods
    .requireValidOrder_(
      [data.proxy, data.maker, data.taker, data.artEditRoyaltyRecipient, data.asset],
      [data.id, data.price, data.artEditRoyaltyRatio, data.salt],
      data.v,
      data.r,
      data.s
    )
    .call()

  let canvas = Canvas.createCanvas(1200,630)
  let c = canvas.getContext('2d')

  promises = [
    readFile('./assets/img/bg.png'),
    readFile('./assets/img/logo.png'),
    readFile('./assets/img/btn.png'),
    readFile('./assets/img/out.png'),
    axios.get(
      'http://www.mycryptoheroes.net/images/heroes/2000/4009.png',
      { responseType: 'arraybuffer' }),
    metadata('mchh', data.id)
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
  c.fillText('ただいま出品中！', 840, 120, 720);

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
  c.fillText(resolved[5].hero_type.name.ja, 840, 255, 720);

  //Lv
  c.fillStyle = '#fff';
  c.font = "40px 'Noto Sans JP'";
  c.textBaseline = "top";
  c.textAlign = 'center';
  c.fillText('Lv.' + resolved[5].attributes.lv, 840, 305, 720);

  //イーサ
  c.fillStyle = '#fff';
  c.font = "bold 75px 'Noto Sans JP Bold'";
  c.textBaseline = "top";
  c.textAlign = 'center';
  c.fillText(web3.utils.fromWei(data.price) + ' ETH', 840, 375, 720);

  const base64EncodedImageString = canvas.toDataURL().substring(22)
  const imageBuffer = Buffer.from(base64EncodedImageString, 'base64')
  const file = bucket.file(hash + '.png')
  file.save(imageBuffer, {
    metadata: {
      contentType: 'image/png'
    }
  })

  const ogp = 'https://firebasestorage.googleapis.com/v0/b/' + bucket.name + '/o/' + encodeURIComponent(hash + '.png') + '?alt=media'
  data.ogp = ogp
  data.timestamp = new Date().getTime()
  data.metadata = await metadata('mchh', data.id)
  await db.collection('order').doc(hash).set(data)

  const result = {
    ogp:ogp,
    hash:hash
  }

  return result

});
