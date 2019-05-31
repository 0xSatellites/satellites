const config = require('./config.json')
const project = 'sand'//process.env.PROJECT
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
const db = admin.firestore()
const settings = { timestampsInSnapshots: true }
db.settings(settings)
const bucket = admin.storage().bucket(config.bucket[project])
const { promisify } = require('util')
const fs = require('fs')
const readFile = promisify(fs.readFile)
const axios = require('axios')
const Canvas = require('canvas')
Canvas.registerFont(__dirname + '/assets/fonts/NotoSansJP-Regular.otf', { family: 'Noto Sans JP' })
Canvas.registerFont(__dirname + '/assets/fonts/NotoSansJP-Bold.otf', { family: 'Noto Sans JP Bold', weight: 'bold' })
const Web3 = require('web3')
const web3 = new Web3(config.node[project].https)
const bazaaar = new web3.eth.Contract(config.abi.bazaaar, config.contract[project].bazaaar)
const ck = new web3.eth.Contract(config.abi.ck, config.contract[project].ck)
const ctn = new web3.eth.Contract(config.abi.ctn, config.contract[project].ctn)
const mchh = new web3.eth.Contract(config.abi.mchh, config.contract[project].mchh)
const mche = new web3.eth.Contract(config.abi.mche, config.contract[project].mche)
const mrm = new web3.eth.Contract(config.abi.mrm, config.contract[project].mrm)
const { google } = require('googleapis')
const cloudbilling = google.cloudbilling('v1')
const { auth } = require('google-auth-library')

async function requireValidOrder(order) {
  return await bazaaar.methods
    .requireValidOrder_(
      [order.proxy, order.maker, order.taker, order.relayerRoyaltyRecipient, order.creatorRoyaltyRecipient, order.asset],
      [order.id, order.price, order.nonce, order.salt, order.expiration, order.relayerRoyaltyRatio, order.creatorRoyaltyRatio, order.referralRatio],
      order.v,
      order.r,
      order.s
    )
    .call()
}

async function validateAssetStatus(order) {
  let passed = false
  let owner, approvedAddress, isApprovedForAll
  switch (order.asset) {
    case config.contract[project].ck:
      owner = await ck.methods.kittyIndexToOwner(order.id).call()
      approvedAddress = await ck.methods.kittyIndexToApproved(order.id).call()
      if (order.maker == owner && config.contract[project].bazaaar == approvedAddress) passed = true
      break
    case config.contract[project].ctn:
      owner = await ctn.methods.entityIndexToOwner(order.id).call()
      approvedAddress = await ctn.methods.entityIndexToApproved(order.id).call()
      if (order.maker == owner && config.contract[project].bazaaar == approvedAddress) passed = true
      break
    case config.contract[project].mche:
      owner = await mche.methods.ownerOf(order.id).call()
      isApprovedForAll = await mche.methods.isApprovedForAll(order.maker, config.contract[project].bazaaar).call()
      if (isApprovedForAll && order.maker == owner) passed = true
      break
    case config.contract[project].mchh:
      owner = await mchh.methods.ownerOf(order.id).call()
      isApprovedForAll = await mchh.methods.isApprovedForAll(order.maker, config.contract[project].bazaaar).call()
      if (isApprovedForAll && order.maker == owner) passed = true
      break
    case config.contract[project].mrm:
    owner = await mrm.methods.ownerOf(order.id).call()
    isApprovedForAll = await mrm.methods.isApprovedForAll(order.maker, config.contract[project].bazaaar).call()
    if (isApprovedForAll && order.maker == owner) passed = true
    break
  }
  return passed
}

async function getAssetMetadataByAssetId(asset, id) {
  let result, response, general, resolved, doc, data
  const promises = []
  switch (asset) {
    case 'ck':
      response = await axios.get(config.api.ck.metadata + id, { headers: { 'x-api-token': config.token.kitty } })
      result = response.data
      result.image = response.data.image_url
      result.iframe = false
      break
    case 'ctn':
      response = await axios.get(config.api.ctn.metadata + id + '.json')
      result = response.data
      result.id = id
      result.iframe = true
      result.iframe_url = result.viewer
      try {
        const entities = await ctn.methods.getEntity(id.toString()).call()
        result.generation = entities.generation
        result.status = {cooldown_index: parseInt(entities.cooldownIndex)}
      } catch (err) {
        console.info(err)
      }
      break
    case 'mchh':
      general = await axios.get(config.api.mch.metadata + 'hero/' + id)
      result = general.data
      result.image = general.data.image_url
      result.iframe = false
      result.mch_artedit = false
      result.royalty_rate = 0
      promises.push(axios.get(config.api.mch.metadata + 'heroType/' + general.data.extra_data.hero_type))
      promises.push(axios.get(config.api.mch.metadata + 'skill/' + general.data.extra_data.active_skill_id))
      promises.push(axios.get(config.api.mch.metadata + 'skill/' + general.data.extra_data.passive_skill_id))
      if (general.data.extra_data.current_art) promises.push(axios.get(config.api.mch.metadata + 'ipfs/' + general.data.extra_data.current_art))
      resolved = await Promise.all(promises)
      result.hero_type = resolved[0].data
      result.active_skill = resolved[1].data
      result.passive_skill = resolved[2].data
      result.sellable = general.data.extra_data.art_history.length > 0 && general.data.attributes.lv > 1
      if (!general.data.extra_data.current_art) break
      result.current_art_data = resolved[3].data
      if (!resolved[3].data.attributes.editor_address) break
      result.current_art_data.attributes.editor_address = web3.utils.toChecksumAddress(resolved[3].data.attributes.editor_address)
      doc = await db.collection('user').doc(result.current_art_data.attributes.editor_address).get() // prettier-ignore
      if (!doc.exists) break
      data = doc.data()
      result.mch_artedit = data.mch_artedit
      if (!data.mch_artedit) break
      if (resolved[3].data.attributes.likes >= 100) {
        result.royalty_rate = 600
      } else if (30 <= resolved[3].data.attributes.likes && resolved[3].data.attributes.likes < 100) {
        result.royalty_rate = 300
      }
      break
    case 'mche':
      general = await axios.get(config.api.mch.metadata + 'extension/' + id)
      result = general.data
      result.image = general.data.image_url
      result.iframe = false
      promises.push(axios(config.api.mch.metadata + 'extensionType/' + general.data.extra_data.extension_type))
      promises.push(axios(config.api.mch.metadata + 'skill/' + general.data.extra_data.skill_id))
      resolved = await Promise.all(promises)
      result.extension_type = resolved[0].data
      result.skill = resolved[1].data
      result.sellable = general.data.extra_data.nickname != undefined
      break
      case 'mrm':
      response = await axios.get("https://asia-northeast1-blockbase-bazaaar-sand.cloudfunctions.net/spMasterRightsforMusicAPI?id=" + id)
      result = response.data
      result.image = response.data.image_url
      result.iframe = false
      break
  }
  return result
}

function coolDownIndexToSpeed(index) {
  if (index == 0) return 'Fast'
  else if (index == 1 || index == 2) return 'Swift'
  else if (index == 3 || index == 4) return 'Snappy'
  else if (index == 5 || index == 6) return 'Brisk'
  else if (index == 7 || index == 8) return 'Plodding'
  else if (index == 9 || index == 10) return 'Slow'
  else if (index == 11 || index == 12) return 'Sluggish'
  else if (index == 13) return 'Catatonic'
  else return 'unknown'
}

exports.metadata = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET')
  res.set('Access-Control-Allow-Headers', 'Content-Type, authorization')
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600')
  const result = await getAssetMetadataByAssetId(req.query.asset, req.query.id)
  res.json(result)
})

exports.order = functions.region('asia-northeast1').https.onCall(async (params, context) => {
  const order = params.order
  const isAssetStatusValid = await validateAssetStatus(order)
  const hash = await requireValidOrder(order)
  if (!isAssetStatusValid || hash == null || order.referralRatio > 100) return
  const batch = db.batch()
  const now = new Date().getTime()
  const assetNameArray = Object.keys(config.contract[project]).filter(key => {
    return config.contract[project][key] === order.asset
  })
  const assetName = assetNameArray[0]
  const metadata = await getAssetMetadataByAssetId(assetName, order.id)
  if (project != 'sand' && (assetName == 'mchh' || assetName == 'mche') && !metadata.sellable ) return
  const promises = [readFile('./assets/img/bg1.png'), axios.get(metadata.image, { responseType: 'arraybuffer' })]
  if (assetName == 'mchh' && metadata.mch_artedit) {
    promises.push(axios.get('https://www.mycryptoheroes.net/arts/' + metadata.extra_data.current_art, { responseType: 'arraybuffer' }))
  }
  const resolved = await Promise.all(promises)
  const canvas = Canvas.createCanvas(1200, 630)
  const c = canvas.getContext('2d')
  c.clearRect(0, 0, 1200, 630)
  const templateImg = new Canvas.Image()
  const characterImg = new Canvas.Image()
  templateImg.src = resolved[0]
  characterImg.src = resolved[1].data
  c.drawImage(templateImg, 0, 0)
  c.drawImage(characterImg, config.ogp[assetName].dx, config.ogp[assetName].dy, config.ogp[assetName].dw, config.ogp[assetName].dh)
  if (assetName == 'mchh' && metadata.mch_artedit) {
    const arteditImg = new Canvas.Image()
    arteditImg.src = resolved[2].data
    c.drawImage(arteditImg, 15, 400, 150, 150)
  }
  c.textBaseline = 'top'
  c.textAlign = 'center'
  c.fillStyle = '#ffff00'
  c.font = "bold 60px 'Noto Sans JP Bold'"
  if (!params.msg) {
    c.fillText('NOW ON SALE!!', 840, 120, 720)
  } else {
    if (params.msg.length <= 9) {
      const sellingMsg = params.msg.replace(/\r?\n/g, '')
      c.fillText(sellingMsg, 840, 120, 720)
    } else {
      const sellingMsg = params.msg.replace(/\r?\n/g, '')
      c.fillText(sellingMsg.substr(0, 9), 840, 80, 720)
      c.fillText(sellingMsg.substr(9, 9), 840, 160, 720)
    }
  }
  c.fillStyle = '#fff'
  c.font = "40px 'Noto Sans JP'"
  if (assetName == 'ck') {
    c.fillText('Id.' + order.id + ' / ' + 'Gen.' + metadata.generation, 840, 255, 720)
    c.fillText(coolDownIndexToSpeed(metadata.status.cooldown_index), 840, 305, 720)
  } else if (assetName == 'ctn') {
    c.fillText('Id.' + order.id + ' / ' + 'Gen.' + metadata.generation, 840, 255, 720)
    c.fillText(coolDownIndexToSpeed(metadata.status.cooldown_index), 840, 305, 720)
  } else if (assetName == 'mchh') {
    c.fillText(metadata.attributes.hero_name + ' / ' + 'Lv.' + metadata.attributes.lv, 840, 255, 720)
    c.fillText(metadata.attributes.rarity, 840, 305, 720)
  } else if (assetName == "mche") {
    c.fillText(metadata.attributes.extension_name + ' / ' + 'Lv.' + metadata.attributes.lv, 840, 255, 720)
    c.fillText(metadata.attributes.rarity, 840, 305, 720)
  } else if (assetName == "mrm") {
    c.fillText(metadata.attributes.name, 840, 255, 720)
  }
  c.font = "bold 75px 'Noto Sans JP Bold'"
  c.fillText(web3.utils.fromWei(order.price) + ' ETH', 840, 375, 720)
  const snapshots = await db.collection('order').where('maker', '==', order.maker).where('asset', '==', order.asset).where('id', '==', order.id).where('valid', '==', true).get() // prettier-ignore
  snapshots.forEach(function(doc) {
    batch.update(db.collection('order').doc(doc.id), { result: { status: 'cancelled' }, valid: false, modified: now })
  })
  const ogp = 'https://firebasestorage.googleapis.com/v0/b/' + bucket.name + '/o/' + encodeURIComponent(hash + '.png') + '?alt=media'
  order.hash = hash
  order.ogp = ogp
  order.valid = true
  order.created = now
  order.metadata = metadata
  order.assetName = assetName
  order.price_sort = web3.utils.padLeft(order.price, 36)
  batch.set(db.collection('order').doc(hash), order) // prettier-ignore
  const base64EncodedImageString = canvas.toDataURL().substring(22)
  const imageBuffer = Buffer.from(base64EncodedImageString, 'base64')
  const file = bucket.file(hash + '.png')
  await Promise.all([file.save(imageBuffer, { metadata: { contentType: 'image/png' } }), batch.commit()])
  // let discordMsg
  // if (assetName == 'ck') discordMsg = 'NOW ON SALE!!' + ' / Id.' + order.id + ' / Gen.' + metadata.generation + ' / ' + coolDownIndexToSpeed(metadata.status.cooldown_index) + ' / #CryptoKitties '
  // else if (assetName == 'ctn') discordMsg = 'NOW ON SALE!!' + ' / Id.' + order.id  + ' / ' + ' / #くりぷ豚 '
  // else if (assetName == 'mchh') discordMsg = 'NOW ON SALE!!' + ' / ' + metadata.attributes.hero_name + ' / Lv.' + metadata.attributes.lv + ' / ' + metadata.attributes.rarity + ' / #MCH '
  // else discordMsg = 'NOW ON SALE!!' + ' / ' + metadata.attributes.extension_name + ' / Lv.' + metadata.attributes.lv + ' / ' + metadata.attributes.rarity + ' / #MCH '
  // const discordData = { content: discordMsg + config.discord.endpoint[project] + `${assetName}/order/` + hash }
  // await axios({ method: 'post', url: 'https://discordapp.com/api/webhooks/' + process.env.DISCORD_WEBHOOK, data: discordData })
  const result = { ogp: ogp, hash: hash }
  return result
})
// prettier-ignore
exports.orderPeriodicUpdatePubSub = functions.region('asia-northeast1').pubsub.topic('orderPeriodicUpdate').onPublish(async message => {
    const takers = [], soldPromises = [], cancelledPromises = [], processed = [] // prettier-ignore
    const batch = db.batch()
    const now = new Date().getTime()
    const blockNum = (await web3.eth.getBlockNumber()) - 25
    const eventPromises = [
      bazaaar.getPastEvents('OrderMatched', { fromBlock: blockNum, toBlock: 'latest' }),
      bazaaar.getPastEvents('OrderCancelled', { fromBlock: blockNum, toBlock: 'latest' })
    ]
    const eventResolved = await Promise.all(eventPromises)
    for (let i = 0; i < eventResolved[0].length; i++) {
      takers.push(eventResolved[0][i].returnValues.taker)
      soldPromises.push(db.collection('order').where('hash', '==', eventResolved[0][i].raw.topics[1]).where('valid', '==', true).get()) // prettier-ignore
    }
    for (let i = 0; i < eventResolved[1].length; i++) {
      cancelledPromises.push(db.collection('order').where('asset', '==', eventResolved[1][i].returnValues.asset).where('id', '==', eventResolved[1][i].returnValues.id.toString()).where('maker', '==', eventResolved[1][i].returnValues.maker).where('valid', '==', true).get()) // prettier-ignore
    }
    const promiseArray = [soldPromises, cancelledPromises]
    const orderResolved = await Promise.all(
      promiseArray.map(function(innerPromiseArray) {
        return Promise.all(innerPromiseArray)
      })
    )
    for (let i = 0; i < orderResolved[0].length; i++) {
      orderResolved[0][i].forEach(function(doc) {
        processed.push(doc.id)
        let ref = db.collection('order').doc(doc.id)
        batch.update(ref, { result: { status: 'sold', taker: takers[i] }, valid: false, modified: now })
      })
    }
    for (let i = 0; i < orderResolved[1].length; i++) {
      orderResolved[1][i].forEach(function(doc) {
        if (!processed.includes(doc.id)) {
          let ref = db.collection('order').doc(doc.id)
          batch.update(ref, { result: { status: 'cancelled' }, valid: false, modified: now })
        }
      })
    }
    await batch.commit()
  })
// prettier-ignore
exports.orderCleaningPubSub = functions.region('asia-northeast1').pubsub.topic('orderCleaning').onPublish(async message => {
    const docs = []
    const now = new Date().getTime()
    const snapshots = await db.collection('order').where('valid', '==', true).get() // prettier-ignore
    snapshots.forEach(async doc => { docs.push(doc.id)})
    for (let i = 0; i < docs.length; i++) {
      const doc = await db.collection('order').doc(docs[i]).get() // prettier-ignore
      const data = doc.data()
      const isAssetStatusValid = await validateAssetStatus(order)
      try {
        const hash = await requireValidOrder(data)
        if (hash != data.hash || !isAssetStatusValid) {
          await db.collection('order').doc(docs[i]).update({result: {status: 'cancelled'},valid: false,modified: now}) // prettier-ignore
        }
      } catch (err) {
        await db.collection('order').doc(docs[i]).update({result: {status: 'cancelled'},valid: false,modified: now}) // prettier-ignore
      }
    }
  })
// prettier-ignore
exports.deactivateOrderImageOnOrderChange = functions.region('asia-northeast1').firestore.document('order/{hash}').onUpdate(async (change, context) => {
    const previous = change.before.data()
    const doc = change.after.data()
    if (!previous.valid || doc.valid) return
    const canvas = Canvas.createCanvas(1200, 630)
    const c = canvas.getContext('2d')
    const imagePromise = axios.get(doc.ogp, { responseType: 'arraybuffer' })
    const resolved = await Promise.all([imagePromise, readFile('./assets/img/out_en.png')])
    const bgImg = new Canvas.Image()
    const outImg = new Canvas.Image()
    bgImg.src = resolved[0].data
    outImg.src = resolved[1]
    c.clearRect(0, 0, 1200, 630)
    c.drawImage(bgImg, 0, 0)
    c.fillStyle = 'rgba(0,0,0,0.7)'
    c.fillRect(0, 0, 1200, 630)
    c.drawImage(outImg, 76, 145)
    const base64EncodedImageString = canvas.toDataURL().substring(22)
    const imageBuffer = Buffer.from(base64EncodedImageString, 'base64')
    const file = bucket.file(change.after.id + '.png')
    file.save(imageBuffer, { metadata: { contentType: 'image/png' } })
  })

exports.stopProject = event => {
  const project = 'projects/' + process.env.GCLOUD_PROJECT
  const pubsubData = JSON.parse(Buffer.from(event.data, 'base64').toString())
  if (pubsubData.costAmount <= pubsubData.budgetAmount) {
    return Promise.resolve('No action shall be taken on current cost ' + pubsubData.costAmount)
  }
  return setAuthCredential()
    .then(() => isBillingEnabled(project))
    .then(enabled => {
      if (enabled) {
        return disableBillingForProject('projects/' + project)
      }
      return Promise.resolve('Billing already in disabled state')
    })
}

function setAuthCredential() {
  return auth.getApplicationDefault().then(res => {
    let client = res.credential
    if (client.createScopedRequired && client.createScopedRequired()) {
      client = client.createScoped(['https://www.googleapis.com/auth/cloud-billing'])
    }
    google.options({ auth: client })
  })
}

function isBillingEnabled(projectName) {
  return cloudbilling.projects.getBillingInfo({ name: projectName }).then(res => res.data.billingEnabled)
}

function disableBillingForProject(projectName) {
  return cloudbilling.projects.updateBillingInfo({ name: projectName, resource: { billingAccountName: '' } }).then(res => {
    return 'Billing disabled successfully: ' + JSON.stringify(res.data)
  })
}

exports.spArteditUserSign = functions.region('asia-northeast1').https.onCall(async (params, context) => {
  const msg = web3.utils.utf8ToHex(
    'この署名を行うと、マイクリプトヒーローズ内で設定されているあなたの作成したアートエディットが、bazaaar内で表示されるようになります。またアセットの売買が発生した際に取引手数料の分配を受け取ることができます。'
  )
  const address = web3.eth.accounts.recover(msg, params.sig)
  if (address == params.address) {
    await db.collection('user').doc(address).update({mch_artedit: params.status,modified: params.modified}) // prettier-ignore
  }
  return address == params.address
})

exports.spTwitter = functions.region('asia-northeast1').https.onCall(async (params, context) => {
  const msg = web3.utils.utf8ToHex(
    'この署名を行うと、あなたのTwitterアカウントがbazaaarに紐づけられます。'
  )
  const address = web3.eth.accounts.recover(msg, params.sig)
  if (address == params.address) {
  await db.collection('user').doc(address).update({twitterAccount: params.twitterAccount}) // prettier-ignore
  }
  return address == params.address
})

const mrm_metadata = require('./assets/token/mrm_metadata.json')
exports.spMasterRightsforMusicAPI = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET')
  res.set('Access-Control-Allow-Headers', 'Content-Type, authorization')
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600')

  const id = req.query.id
  if(mrm_metadata[id]){
    res.json(mrm_metadata[id])
  }else{
    res.json('code=404, message=Not Found')
  }
})

const express = require('express');
const app = express();
app.use(function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET')
  res.set('Access-Control-Allow-Headers', 'Content-Type, authorization')
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600')
  next();
});

app.get('/', async function(req, res){
  res.send('This is bazaaarAPI');
})

app.get('/order', async function(req, res){
  const result = []
  const limit = Number(req.query.limit)
  if (limit > 300) limit = 300
  const snapshots = await db.collection('order').where('valid', '==', true).orderBy('created', 'desc').limit(limit).get() // prettier-ignore
  snapshots.forEach(function(doc) {
    const data = doc.data()
    result.push({
      price: data.price,
      id: data.id,
      name: data.metadata.name,
      image: data.metadata.image_url,
      ogp: data.ogp,
      url: config.host[project] + data.symbol + '/order/' + data.hash
    })
  })
  res.send(result)
})

app.get('/mrmholder', async function(req, res){
  const result = []
  const id = Number(req.query.id)
  const totalSupply = await mrm.methods.totalSupply().call()
  if(id > totalSupply) res.send('code=404, message=Not Found')
  owner = await mrm.methods.ownerOf(id).call()
  await db.collection('user').doc(owner).get()
    .then(doc => {
      if (!doc.exists) {
        res.send('code=404, message=Not Found')
      } else {
        const data = {
          //todo uidを@のuseridに変更する
          'id': id,
          'owner': owner,
          'twitterId': doc.data().twitterAccount[0].uid,
          'twitterIcon': doc.data().twitterAccount[0].photoURL
        }
        res.send(data)
      }
    })
})

exports.api = functions.https.onRequest(app);
