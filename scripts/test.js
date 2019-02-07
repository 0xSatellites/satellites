const config = require('./config.json')
const Web3 = require('web3')
const web3 = new Web3(config.node.rinkeby.https)
const {PubSub} = require('@google-cloud/pubsub');

const admin = require('firebase-admin')

const serviceAccount = require('./.serviceAccountKey.json');

const contract = {
  bazaaar_v1: new web3.eth.Contract(
    config.abi.bazaaar_v1,
    config.contract.rinkeby.bazaaar_v1
  )
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore()
/*

web3.eth.getTransactionReceipt('0x160e001da85bb65d05faf2cf83ff873e1fc82ba5e696787ee7642f263a642a27')
.then(function(val){
  const time = new Date().getTime()
  if(web3.utils.toChecksumAddress(val.logs[0].address) == config.contract.rinkeby.bazaaar_v1){
    db.collection('order')
    .where("maker", "==", web3.utils.toChecksumAddress(web3.utils.toHex(val.logs[0].data.substring(26, 66))))
    .where("asset", "==", web3.utils.toChecksumAddress(web3.utils.toHex(val.logs[0].data.substring(90, 130))))
    .where("id", "==", web3.utils.hexToNumber(val.logs[0].data.substring(130, 194)).toString())
    .get()
    .then(snapshots => {
      snapshots.forEach(async doc => {
        if(doc.id != val.logs[0].topics[1]){
          await db.collection('order')
          .doc(doc.id)
          .update({status:'キャンセル', valid:false, timestamp:time})
        }
      })
    })
  }
  db.collection('order')
    .doc(val.logs[0].topics[1])
    .update({status:'売却済', valid:false, timestamp:time})
})
*/




const pubsub = new PubSub({
  projectId: 'blockbase-bazaaar-sand',
  keyFilename: '.serviceAccountKey.json'
});

const registerMessage = {
  transactionHash: '0x269f223e466fdb060d1e5316c630552fa493e9af6eac451dd416585e02f7fb4a'
};

// Publish
const topic = pubsub.topic('orderMatched');
// console.log(topic)
// const publisher = topic.publisher();
topic.publish(Buffer.from(JSON.stringify(registerMessage)), function (err) {
  if (err) {
    console.log(err);
  }
});
