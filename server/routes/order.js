const config = require('../../config.json')

var axios = require('axios')

var express = require('express')
const router = express.Router()

const admin = require('firebase-admin')
var db = admin.firestore()

const Web3 = require('web3')
const web3 = new Web3(config.node.https)

const contract = {
  bazaaar_v1: new web3.eth.Contract(
    config.abi.bazaaar.proxy_v1,
    config.contract.bazaaar.proxy_v1
  )
}

router.post('/v1', async function(req, res) {
  console.log('v1')
  const order = req.body

  const hash = await contract.bazaaar_v1.methods
    .requireValidOrder_(
      [order.proxy, order.maker, order.taker, order.artEditRoyaltyRecipient],
      [order.id, order.price, order.artEditRoyaltyRatio, order.salt],
      order.v,
      order.r,
      order.s
    )
    .call()

  const date = new Date()
  const time = date.getTime()

  order.status = config.constant.selling
  order.created = time
  order.modified = time

  console.log('db:write')
  await db
    .collection(config.constant.order)
    .doc(hash)
    .set(order)

  console.log('discord:post')
  await axios({
    method: 'post',
    url: process.env.DISCORD_WEBHOOK,
    data: {
      content: config.discord.endpoint + hash
    }
  })

  res.json({ status: true })
})

module.exports = router
