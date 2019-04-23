const config = require('./config.json')
const project = 'sand'

const admin = require('firebase-admin');
const serviceAccount = require('./.serviceAccountKey.json');

const Web3 = require('web3')
const web3 = new Web3(config.node[project].https)

const bazaaar_v1 = new web3.eth.Contract(
    config.abi.bazaaar_v1,
    config.contract[project].bazaaar_v1
)
const bazaaar_v2 = new web3.eth.Contract(
    config.abi.bazaaar_v2,
    config.contract[project].bazaaar_v2
)
const bazaaar_v3 = new web3.eth.Contract(
    config.abi.bazaaar_v3,
    config.contract[project].bazaaar_v3
)


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

var db = admin.firestore()
//const batch = db.batch()
const now = new Date().getTime()

async function deactivate(){
    const snapshots = await db.collection('order').where('valid', '==', true).get()
    snapshots.forEach(doc => {
        const ref = db.collection('order').doc(doc.id)
        batch.update(ref, {
            result: { status: 'cancelled' },
            valid: false,
            modified: now
        })
    })
    batch.commit()
}

async function cleaning(){
    const snapshots = await db.collection('order').where('valid', '==', true).get()
    snapshots.forEach(async doc => {
        const batch = db.batch()
        const record = await db.collection('order').doc(doc.id).get()
        const order = record.data()
        if(order.proxy == config.contract[project].bazaaar_v1) {
            const hash = await bazaaar_v1.methods
            .requireValidOrder_(
              [
                order.proxy,
                order.maker,
                order.taker,
                order.creatorRoyaltyRecipient,
                order.asset
              ],
              [
                order.id,
                order.price,
                order.nonce,
                order.salt,
                order.expiration,
                order.creatorRoyaltyRatio,
                order.referralRatio
              ],
              order.v,
              order.r,
              order.s
            )
            .call()
            if(hash != order.hash) {
              console.info('deactivate: ' + doc.id)
              db.collection('order').doc(doc.id).update({
                result: { status: 'cancelled' },
                valid: false,
                modified: now
              })
              .catch(function(error) {
                  console.error("Error writing document: ", error);
              });
            }
        } else if (order.proxy == config.contract[project].bazaaar_v2) {
            const hash = await bazaaar_v2.methods
            .requireValidOrder_(
              [
                order.proxy,
                order.maker,
                order.taker,
                order.creatorRoyaltyRecipient,
                order.asset
              ],
              [
                order.id,
                order.price,
                order.nonce,
                order.salt,
                order.expiration,
                order.creatorRoyaltyRatio,
                order.referralRatio
              ],
              order.v,
              order.r,
              order.s
            )
            .call()
            if(hash != order.hash) {
              console.info('deactivate: ' + doc.id)
              db.collection('order').doc(doc.id).update({
                result: { status: 'cancelled' },
                valid: false,
                modified: now
              })
              .catch(function(error) {
                  console.error("Error writing document: ", error);
              });
            }
        } else if (order.proxy == config.contract[project].bazaaar_v3) {
            const hash = await bazaaar_v3.methods
            .requireValidOrder_(
              [
                order.proxy,
                order.maker,
                order.taker,
                order.creatorRoyaltyRecipient,
                order.asset
              ],
              [
                order.id,
                order.price,
                order.nonce,
                order.salt,
                order.expiration,
                order.creatorRoyaltyRatio,
                order.referralRatio
              ],
              order.v,
              order.r,
              order.s
            )
            .call()
            if(hash != order.hash) {
              console.info('deactivate: ' + doc.id)
              db.collection('order').doc(doc.id).update({
                result: { status: 'cancelled' },
                valid: false,
                modified: now
              })
              .catch(function(error) {
                  console.error("Error writing document: ", error);
              });
            }
        }
    })
}

//cleaning()
//deactivate()
//report()

const axios = require('axios')

async function report(){
  const result = await axios.get('https://api.etherscan.io/api?module=account&action=txlist&address=0x2EDfeaC6A8c63A1CB4445E780C4e004b1e06466A&startblock=0&endblock=99999999&sort=asc&apikey=PFAVA4Q7J85X178D6GNAAH6XKU4Q3DNHF2')
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

  var max = 0
  for(var i=0; i<result.data.result.length; i++){
      if(result.data.result[i].to == "0x2edfeac6a8c63a1cb4445e780c4e004b1e06466a") {
        console.log(result.data.result[i].gas)
        if(max < parseInt(result.data.result[i].gasUsed)) {
            max =  parseInt(result.data.result[i].gasUsed)
        }
        if(result.data.result[i].input.substring(0, 10) == "0xc709a742"){
            match++
            value = value + result.data.result[i].value/1000000000000000000
            if(result.data.result[i].timeStamp > now){
                match_24h++
                value_24h = value_24h + result.data.result[i].value/1000000000000000000
                if(result.data.result[i].isError==1){
                    match_error_24++
                }
            }
        } else if (result.data.result[i].input.substring(0, 10) == "0xa33b2d26") {
            cancel++
            if(result.data.result[i].timeStamp > now){
                cancel_24h++
                if (result.data.result[i].isError==1){
                    cancel_error_24++
                }
            }
        }
      }
  }

  var etherescan = "--- Checking Etherscan ---"
  etherescan = etherescan + '\n約定総数: ' + match
  etherescan = etherescan + '\nキャンセル総数: ' + cancel
  etherescan = etherescan + '\n流通総額: ' + value + 'ETH'
  etherescan = etherescan + '\n24h 約定数: ' + match_24h　
  etherescan = etherescan + '\n24h キャンセル数: ' + cancel_24h
  etherescan = etherescan + '\n24h 流通額: ' + value_24h + 'ETH'

  etherescan = etherescan + '\n24h 約定エラー: ' + match_error_24
  etherescan = etherescan + '\n24h キャンセルエラー: ' + cancel_error_24
  console.log(etherescan)
  console.log(max)

}