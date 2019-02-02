const config = require('./config.json')
const serviceAccount = require('./.serviceAccountKey.json')

const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

const axios = require("axios")

const {promisify} = require('util')
const fs = require('fs')
const readFile = promisify(fs.readFile)

exports.metadata = functions.region('asia-northeast1').https.onCall(async (data, context) => {

  var response

  if(data.asset == 'mchh') {
    let general = await axios({
      method:'get',
      url:config.api.mch.metadata + 'hero/' + data.id,
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

  } else if (data.asset == 'mche'){
    let general = await axios({
      method:'get',
      url:config.api.mch.metadata + 'extension/' + data.id,
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

})

exports.order = functions.region('asia-northeast1').https.onCall(async (data, context) => {
  let canvas = Canvas.createCanvas(1200,630)
  let c = canvas.getContext('2d')

  //背景画像
  let bgImg = new Canvas.Image()
  bgImg.src = await readFile('./assets/img/bg.png')

  //ロゴ
  let logoImg = new Canvas.Image()
  logoImg.src = await readFile('./assets/img/logo.png')

  //ボタン
  let btnImg = new Canvas.Image()
  btnImg.src = await readFile('./assets/img/btn.png')

  //キャラクター画像
  //let characterImg = new Canvas.Image();
  //characterImg.src = await http.get('http://www.mycryptoheroes.net/images/heroes/2000/4009.png')

  let outImg = new Canvas.Image();
  outImg.src = await readFile('./assets/img/out.png')

  //初期化
  c.clearRect(0, 0, 1200, 630);

  //背景画像
  c.drawImage(bgImg, 0, 0);

  //ロゴ
  c.drawImage(logoImg, 1002, 21);

  //ボタン
  c.drawImage(btnImg, 696, 489);

  //キャラクター画像
  //c.drawImage(characterImg, 15, 90, 450, 450);

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
  c.fillText('Masamune Date', 840, 255, 720);

  //Lv
  c.fillStyle = '#fff';
  c.font = "40px 'Noto Sans JP'";
  c.textBaseline = "top";
  c.textAlign = 'center';
  c.fillText('Lv.70', 840, 305, 720);

  //イーサ
  c.fillStyle = '#fff';
  c.font = "bold 75px 'Noto Sans JP Bold'";
  c.textBaseline = "top";
  c.textAlign = 'center';
  c.fillText('0.0001 ETH', 840, 375, 720);

  return canvas.toDataURL()

});
