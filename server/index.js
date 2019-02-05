const config = require('./config.json')
const admin = require('firebase-admin')
const serviceAccount = require('./.serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore()

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.WebsocketProvider(config.node.rinkeby.wss))

const contract = {
  bazaaar_v1: new web3.eth.Contract(
    config.abi.bazaaar_v1,
    config.contract.bazaaar_v1
  )
}

contract.bazaaar_v1.events.OrderMatched(null, async function(error, result) {
  console.log('contract.bazaaar_v1.events.OrderMatched')

  if (error) return
  time = new Date().getTime()

  db.collection('order')
  .where("maker", "==", result.returnValues.maker)
  .where("asset", "==", result.returnValues.asset)
  .where("id", "==", result.returnValues.id)
  .get()
  .then(snapshots => {
    snapshots.forEach(async doc => {
      if(doc.id != result.returnValues.hash){
        await db.collection('order')
        .doc(result.returnValues.hash)
        .update({status:'キャンセル', valid:false, timestamp:time})
      }
    })
  });

  db.collection('order')
    .doc(result.returnValues.hash)
    .update({status:'売却済', valid:false, timestamp:time})

})

contract.bazaaar_v1.events.OrderCancelled(null, async function(error, result) {
  console.log('contract.bazaaar_v1.events.OrderCancelled')

  if (error) return
  /*
  const date = new Date()
  const time = date.getTime()
  const key = result.raw.topics[1]
  console.log('db:update')
  db.collection(config.constant.order)
    .doc(key)
    .update({status:config.constant.cancelled, modified:time})
  */
})
