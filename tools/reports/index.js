const admin = require('firebase-admin')
admin.initializeApp()
const functions = require('firebase-functions');

var db = admin.firestore();
var day = new Date();
var yesterday = day.setDate(day.getDate() - 1) ;

exports.dailyReportPubSub = functions
  .pubsub.topic('dailyReport')
  .onPublish(async () => {
  var result1 = db.collection('order').where("created", ">", yesterday).get()
  .then(snapshot => {
      var yesterdayOrders = snapshot.docs.length
      result1 = "24h売り注文数：" + yesterdayOrders
    })
  .catch((err) => {
        console.log('Error getting documents', err);
    })
  var arr = [];
  var volume = 0;
  var result2 =db.collection('order')
      .where('modified', '>', yesterday)
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
      .where('valid', '==', true)
      .get()
      .then(snapshot =>{
        var currentOrders =snapshot.docs.length
        result3 = '\n現在の売り注文数：' + currentOrders
        })
      .catch((err) => {
        console.log('Error getting documents', err);
      });

  await Promise.all([result1, result2, result3])


  //Etherscan

  const etherscanResult = await axios.get('http://api.etherscan.io/api?module=account&action=txlist&address=0x2EDfeaC6A8c63A1CB4445E780C4e004b1e06466A&startblock=0&endblock=99999999&sort=asc&apikey=PFAVA4Q7J85X178D6GNAAH6XKU4Q3DNHF2')
  var match = 0
  var match_24h = 0
  var match_error_24 = 0
  var cancel = 0
  var cancel_24h = 0
  var cancel_error_24 = 0
  var value = 0
  var value_24h = 0

  var dt = new Date()
  dt.setHours(dt.getHours() - 24)
  var now = Math.round(dt.getTime() / 1000)

  for(var i=0; i<etherscanResult.data.result.length; i++){
      if(etherscanResult.data.result[i].to == "0x2edfeac6a8c63a1cb4445e780c4e004b1e06466a") {
        if(etherscanResult.data.result[i].input.substring(0, 10) == "0xc709a742"){
            match++
            value = value + etherscanResult.data.result[i].value/1000000000000000000
            if(etherscanResult.data.result[i].timeStamp > now){
                match_24h++
                value_24h = value_24h + etherscanResult.data.result[i].value/1000000000000000000
                if(etherscanResult.data.result[i].isError==1){
                    match_error_24++
                }
            }
        } else if (etherscanResult.data.result[i].input.substring(0, 10) == "0xa33b2d26") {
            cancel++
            if(etherscanResult.data.result[i].timeStamp > now){
                cancel_24h++
                if (etherscanResult.data.result[i].isError==1){
                    cancel_error_24++
                }
            }
        }
      }
  }

  var etherescan = "\n--- Checking Etherscan ---"
  etherescan = etherescan + '\n約定総数: ' + match
  etherescan = etherescan + '\nキャンセル総数: ' + cancel
  etherescan = etherescan + '\n流通総額: ' + value + 'ETH'
  etherescan = etherescan + '\n24h 約定数: ' + match_24h　
  etherescan = etherescan + '\n24h キャンセル数: ' + cancel_24h
  etherescan = etherescan + '\n24h 流通額: ' + value_24h + 'ETH'

  etherescan = etherescan + '\n24h 約定エラー: ' + match_error_24
  etherescan = etherescan + '\n24h キャンセルエラー: ' + cancel_error_24

  //Etherscan end

  const message = result1 + result2 + result3 + etherescan
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
