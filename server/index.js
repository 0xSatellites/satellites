// winston 3 example.
const winston = require('winston');

// Imports the Google Cloud client library for Winston
const {LoggingWinston} = require('@google-cloud/logging-winston');

// const loggingWinston = new LoggingWinston();

// Create a Winston logger that streams to Stackdriver Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"
const loggingWinston = new LoggingWinston({
  projectId: 'blockbase-bazaaar-sand',
  keyFilename: '.serviceAccountKey.json', //logging用のserviceAccountKey
  level: 'info',// log at 'warn' and above ,
  labels: { "env": "poc" }
  ,
  logName: "poc-gcl.log"
});

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    // Add Stackdriver Logging
    loggingWinston,
  ],
});

// Writes some log entries
logger.error('warp nacelles offline');
logger.info('shields at 99%');

/////////////////////////////////////////////////////////

const config = require('./config.json')
const admin = require('firebase-admin')
const { PubSub } = require('@google-cloud/pubsub')

const serviceAccount = require('./.serviceAccountKey.json')

const project = process.env.PROJECT

const pubsub = new PubSub({
  projectId: config.firebase[project].projectId,
  keyFilename: '.serviceAccountKey.json'
})

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.WebsocketProvider(config.node[project].wss))

const contract = {
  bazaaar_v1: new web3.eth.Contract(
    config.abi.bazaaar_v1,
    config.contract[project].bazaaar_v1
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
