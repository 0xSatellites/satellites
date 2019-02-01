const functions = require('firebase-functions')
const admin = require('firebase-admin')

const http = require("http");
const fs = require('fs')
const {promisify} = require('util')

const readFile = promisify(fs.readFile)

const draw = require('./lib/draw')
const serviceAccount = require('./.serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

exports.order = functions.region('asia-northeast1').https.onCall(async (data, context) => {

  const canvas = Canvas.createCanvas(1200,630)
  const context = canvas.getContext('2d')

  //背景画像
  const bgImg = new Canvas.Image()
  bgImg.src = await readFile('./assets/img/bg.png')

  //ロゴ
  const logoImg = new Canvas.Image()
  logoImg.src = await readFile('./assets/img/logo.png')

  //ボタン
  const btnImg = new Canvas.Image()
  btnImg.src = await readFile('./assets/img/btn.png')

  //キャラクター画像
  //const characterImg = new Canvas.Image();
  //characterImg.src = await http.get('http://www.mycryptoheroes.net/images/heroes/2000/4009.png')

  const outImg = new Canvas.Image();
  outImg.src = await readFile('./assets/img/out.png')

  //初期化
  context.clearRect(0, 0, 1200, 630);

  //背景画像
  context.drawImage(bgImg, 0, 0);

  //ロゴ
  context.drawImage(logoImg, 1002, 21);

  //ボタン
  context.drawImage(btnImg, 696, 489);

  //キャラクター画像
  //context.drawImage(characterImg, 15, 90, 450, 450);

  //コメント 単一行
  context.fillStyle = '#ffff00';
  context.font = "bold 80px 'Noto Sans JP Bold'";
  context.textBaseline = "top";
  context.textAlign = 'center';
  context.fillText('ただいま出品中！', 840, 120, 720);

  //コメント 1行目
  //context.fillStyle = '#ffff00';
  //context.font = "bold 64px 'Noto Sans JP'";
  //context.textBaseline = "top";
  //context.textAlign = 'center';
  //context.fillText('テキスト可変の場合', 840, 80, 720);

  //コメント 2行目
  //context.fillStyle = '#ffff00';
  //context.font = "bold 64px 'Noto Sans JP'";
  //context.textBaseline = "top";
  //context.textAlign = 'center';
  //context.fillText('最大18文字まで可能', 840, 160, 720);

  //名前
  context.fillStyle = '#fff';
  context.font = "40px 'Noto Sans JP'";
  context.textBaseline = "top";
  context.textAlign = 'center';
  context.fillText('Masamune Date', 840, 255, 720);

  //Lv
  context.fillStyle = '#fff';
  context.font = "40px 'Noto Sans JP'";
  context.textBaseline = "top";
  context.textAlign = 'center';
  context.fillText('Lv.70', 840, 305, 720);

  //イーサ
  context.fillStyle = '#fff';
  context.font = "bold 75px 'Noto Sans JP Bold'";
  context.textBaseline = "top";
  context.textAlign = 'center';
  context.fillText('0.0001 ETH', 840, 375, 720);

  return canvas.toDataURL()

});
