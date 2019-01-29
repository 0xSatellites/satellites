const config = require('../../config.json')

const express = require('express')
const router = express.Router()

const admin = require('firebase-admin')
const db = admin.firestore()

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.WebsocketProvider(config.node.wss))

const contract = {
  bazaaar_v1: new web3.eth.Contract(
    config.abi.bazaaar.proxy_v1,
    config.contract.bazaaar.proxy_v1
  ),
  mchh: new web3.eth.Contract(config.abi.mch.hero, config.contract.mch.hero),
  mche: new web3.eth.Contract(
    config.abi.mch.extension,
    config.contract.mch.extension
  )
}

contract.mchh.events.Transfer(null, async function(error, result) {
  console.log('contract.mchh.events.Transfer')
  if (error) return
  //Todo filter and update metadata
})

contract.mche.events.Transfer(null, async function(error, result) {
  console.log('contract.mche.events.Transfer')
  if (error) return
  //Todo filter and update metadata
})

contract.bazaaar_v1.events.OrderMatched(null, async function(error, result) {
  console.log('contract.bazaaar_v1.events.OrderMatched')
  if (error) return
  const date = new Date()
  const time = date.getTime()
  const key = result.raw.topics[1]
  console.log('db:update')
  db.collection(config.constant.order)
    .doc(key)
    .update({status:config.constant.matched, modified:time})
})

contract.bazaaar_v1.events.OrderCancelled(null, async function(error, result) {
  console.log('contract.bazaaar_v1.events.OrderCancelled')
  if (error) return
  const date = new Date()
  const time = date.getTime()
  const key = result.raw.topics[1]
  console.log('db:update')
  db.collection(config.constant.order)
    .doc(key)
    .update({status:config.constant.cancelled, modified:time})
})

module.exports = router
