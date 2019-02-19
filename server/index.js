const config = require('./config.json')
const admin = require('firebase-admin')
const { PubSub } = require('@google-cloud/pubsub')

const serviceAccount = require('./.serviceAccountKey.json')

const pubsub = new PubSub({
  projectId: 'blockbase-bazaaar-sand',
  keyFilename: '.serviceAccountKey.json'
})

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.WebsocketProvider(config.node.rinkeby.wss))

const contract = {
  bazaaar_v1: new web3.eth.Contract(
    config.abi.bazaaar_v1,
    config.contract.rinkeby.bazaaar_v1
  )
}

contract.bazaaar_v1.events.OrderMatched(null, async function(error, result) {
  console.log('contract.bazaaar_v1.events.OrderMatched')
  if (error) return
  const registerMessage = {
    transactionHash: result.transactionHash
  };
  const topic = pubsub.topic('orderMatched');
  topic.publish(Buffer.from(JSON.stringify(registerMessage)), function (err) {
    if (err) {
      console.log(err);
    }
  })
})

contract.bazaaar_v1.events.OrderCancelled(null, async function(error, result) {
  console.log('contract.bazaaar_v1.events.OrderCancelled')
  if (error) return
  const registerMessage = {
    transactionHash: result.transactionHash
  }
  const topic = pubsub.topic('orderCancelled');
  topic.publish(Buffer.from(JSON.stringify(registerMessage)), function (err) {
    if (err) {
      console.log(err);
    }
  })
})

console.log("server on")
