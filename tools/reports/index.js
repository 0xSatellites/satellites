const admin = require('firebase-admin');
const functions = require('firebase-functions');

var serviceAccount = require('./blockbase-bazaaar-sand-firebase-adminsdk-g8ket-3e86aa8c6f.json'); //本番環境のとき要変更

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://blockbase-bazaaar-sand.firebaseio.com" //本番環境のとき要変更
});

var db = admin.firestore();
var day = new Date();
var yesturday = day.setDate(day.getDate() - 1) ;


exports.dailyReports = functions
  .https.onRequest(async () => {
  var result1 = db.collection('order').where("created", ">", yesturday).get()
  .then(snapshot => {
      orders = snapshot.size
      result1 = "24h売り注文数：" + orders
    })
  .catch((err) => {
        console.log('Error getting documents', err);
    })
  var arr = [];
  var volume = 0;
  var result2 =db.collection('order')
      .where('created', '>', yesturday)
      .where('result.status', '==', "sold")
      .get()
      .then(snapshot =>{
        snapshot.forEach(doc =>{
          arr.push(doc.data().price)
          volume += (Number(doc.data().price)/1000000000000000000)
        })
      var maxDeal = Math.max(...arr)
      var index = arr.indexOf(maxDeal.toString())
      var URL = "https://bazaaar.io/ck/order/"+snapshot.docs[index].id
      result2 ='\n24h流通総額：' +volume + 'ETH\n24h最高値約定：' +(maxDeal/1000000000000000000) + 'ETH\nURL：'+URL
      })
      .catch((err) => {
        console.log('Error getting documents', err);
    })

    var result3 =db.collection('order')
      .where('result', '==', null)
      .get()
      .then(snapshot =>{
        var currentOrders =snapshot.docs.length
        result3 = '\n現在の売り注文数：' + currentOrders
        })
      .catch((err) => {
        console.log('Error getting documents', err);
      });

  await Promise.all([result1, result2, result3])
  const message = result1 + result2 + result3
  console.log(message)


  const https = require('https');

  //メッセージ設定
  var data = JSON.stringify({"username":"Daily Report","text": message,"icon_emoji":":ghost:"});

  //オプション情報設定
  var  options = {
      hostname: 'hooks.slack.com',
      port: 443,
      path: '/services/TB1HX99L2/BGPKDCHPA/BZJzmIn5jppdQPIxOkpK3Zqr',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
      }
  };

  //リクエスト
  var req = https.request(options, (res) =>{
      if(res.statusCode===200){
          console.log("OK:"+res.statusCode);
      }else{
          console.log("Status Error:"+res.statusCode);
      }
  });

  //そもそもなエラー時
  req.on('error',(e)=>{
      console.error(e);
  });

  //データ送信
  req.write(data);
  //終わり
  req.end();


  })
