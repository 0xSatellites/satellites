const config = require('./config.json')
const project = 'sand'
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
const db = admin.firestore()
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)
const bucket = admin.storage().bucket(config.bucket[project])
const {
  promisify
} = require('util')
const fs = require('fs')
const readFile = promisify(fs.readFile)
const axios = require('axios')
const Canvas = require('canvas')
Canvas.registerFont(__dirname + '/assets/fonts/NotoSansJP-Regular.otf', {
  family: 'Noto Sans JP'
})
Canvas.registerFont(__dirname + '/assets/fonts/NotoSansJP-Bold.otf', {
  family: 'Noto Sans JP Bold',
  weight: 'bold'
})
const Web3 = require('web3')
const web3 = new Web3(config.node[project].https)
const bazaaar = new web3.eth.Contract(config.abi.bazaaar, config.contract[project].bazaaar)
const ck = new web3.eth.Contract(config.abi.ck, config.contract[project].ck)
const ctn = new web3.eth.Contract(config.abi.ctn, config.contract[project].ctn)
const mchh = new web3.eth.Contract(config.abi.mchh, config.contract[project].mchh)
const mche = new web3.eth.Contract(config.abi.mche, config.contract[project].mche)

const {
  google
} = require('googleapis')
const cloudbilling = google.cloudbilling('v1')
const {
  auth
} = require('google-auth-library')
const PROJECT_NAME = `projects/ ${config.billion[project]}`

function setAuthCredential() {
  return auth.getApplicationDefault().then(res => {
    let client2 = res.credential
    if (client2.createScopedRequired && client2.createScopedRequired()) {
      client2 = client2.createScoped(['https://www.googleapis.com/auth/cloud-billing'])
    }
    // Set credential globally for all requests
    google.options({
      auth: client2
    })
  })
}

function isBillingEnabled(projectName) {
  return cloudbilling.projects
    .getBillingInfo({
      name: projectName
    })
    .then(res => res.data.billingEnabled)
}

function disableBillingForProject(projectName) {
  return cloudbilling.projects
    .updateBillingInfo({
      name: projectName,
      // Setting this to empty is equivalent to disabling billing.
      resource: {
        billingAccountName: ''
      }
    })
    .then(res => {
      return 'Billing disabled successfully: ' + JSON.stringify(res.data)
    })
}

async function validateAssetStatus (order) {
  const bazaaarAddress = config.contract[project].bazaaar
  let passed = false
  let owner
  let approvedAddress
  let isApprovedForAll
  switch (order.assetName) {
    case 'ck':
      owner = await ck.methods.kittyIndexToOwner(order.id).call()
      approvedAddress = await ck.methods.kittyIndexToApproved(order.id).call()
      if(order.maker == owner && bazaaarAddress == approvedAddress) passed = true
      break
    case 'ctn':
      owner = await ctn.methods.entityIndexToOwner(order.id).call()
      approvedAddress = await ctn.methods.entityIndexToApproved(order.id).call()
      if(order.maker == owner && bazaaarAddress == approvedAddress) passed = true
      break
    case 'mchh':
      owner = await mchh.methods.ownerOf(order.id).call()
      isApprovedForAll = await mchh.methods.isApprovedForAll(order.maker, config.contract[project].bazaaar)
      if (isApprovedForAll && order.maker != owner) passed = true
      break
    case 'mche':
      owner = await mche.methods.ownerOf(order.id).call()
      isApprovedForAll = await mche.methods.isApprovedForAll(order.maker, config.contract[project].bazaaar_v3)
      if (isApprovedForAll && order.maker != owner) passed = true
      break
    default:
      return passed
  }
}

//Done
async function getAssetMetadataByAssetId(asset, id) {
  let result
  let response
  let general
  let promises
  let resolved
  console.log("start")
  switch (asset) {
    case 'ck':
      console.log("ck")
      response = await axios.get(config.api.ck.metadata + id, {
        headers: {
          'x-api-token': config.token.kitty
        }
      })
      result = response.data
      break
    case 'ctn':
      console.log("ctn")
      response = await axios.get(config.api.ctn.metadata + id + '.json')
      result = response.data
      break
    case 'mchh':
      console.log("mchh")
      general = await axios.get(config.api.mch.metadata + 'hero/' + id)
      response = general.data
      promises = []
      promises.push(axios.get(config.api.mch.metadata + 'heroType/' + general.data.extra_data.hero_type))
      promises.push(axios.get(config.api.mch.metadata + 'skill/' + general.data.extra_data.active_skill_id))
      promises.push(axios.get(config.api.mch.metadata + 'skill/' + general.data.extra_data.passive_skill_id))
      console.log("mchh1")
      if (general.data.extra_data.current_art) {
        promises.push(axios.get(config.api.mch.metadata + 'ipfs/' + general.data.extra_data.current_art))
      }

      resolved = await Promise.all(promises)
      response.hero_type = resolved[0].data
      response.active_skill = resolved[1].data
      response.passive_skill = resolved[2].data

      if (general.data.extra_data.art_history.length > 0) {
        response.sellable = true
      } else {
        response.sellable = false
      }

      response.mch_artedit = false
      // response.royalty_rate = 0
      if (resolved.length < 4) break
      response.current_art_data = resolved[3].data
      if (!response.current_art_data.attributes.editor_address) break
      const editor_address = web3.utils.toChecksumAddress(response.current_art_data.attributes.editor_address)
      const doc = await db
        .collection('user')
        .doc(editor_address)
        .get()
      console.log(doc.exists)
      if (!doc.exists){
        result = response
        break
      }
      response.mch_artedit = doc.data().mch_artedit
      if (!response.mch_artedit) break
      const likes = response.current_art_data.attributes.likes
      if (likes >= 100) {
        response.royalty_rate = 600
      } else if (30 <= likes && likes < 100) {
        response.royalty_rate = 300
      }
      result = response
      break
    case 'mche':
      console.log("mche")
      general = await axios.get(config.api.mch.metadata + 'extension/' + id)
      response = general.data
      promises = []
      promises.push(axios(config.api.mch.metadata + 'extensionType/' + general.data.extra_data.extension_type))
      promises.push(axios(config.api.mch.metadata + 'skill/' + general.data.extra_data.skill_id))
      resolved = await Promise.all(promises)
      response.extension_type = resolved[0].data
      response.skill = resolved[1].data
      if (general.data.extra_data.nickname) {
        response.sellable = true
      } else {
        response.sellable = false
      }
      result = response
      break
  }
  return result
}


//Done
function coolDownIndexToSpeed(index) {
  switch (index) {
    case 0:
      return 'Fast'
    case 1:
    case 2:
      return 'Swift'
    case 3:
    case 4:
      return 'Snappy'
    case 5:
    case 6:
      return 'Brisk'
    case 7:
    case 8:
      return 'Plodding'
    case 9:
    case 10:
      return 'Slow'
    case 11:
    case 12:
      return 'Sluggish'
    case 13:
      return 'Catatonic'
    default:
      return 'unknown'
  }
}

//Done(あとでなおす)
exports.stopProject = event => {
  const pubsubData = JSON.parse(Buffer.from(event.data, 'base64').toString())
  if (pubsubData.costAmount <= pubsubData.budgetAmount) {
    return Promise.resolve('No action shall be taken on current cost ' + pubsubData.costAmount)
  }
  return setAuthCredential()
    .then(() => isBillingEnabled(PROJECT_NAME))
    .then(enabled => {
      if (enabled) {
        return disableBillingForProject(PROJECT_NAME)
      }
      return Promise.resolve('Billing already in disabled state')
    })
}

exports.metadata = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  console.log("metadata start")
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET')
  res.set('Access-Control-Allow-Headers', 'Content-Type, authorization')
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600')
  const result = await getAssetMetadataByAssetId(req.query.asset, req.query.id)
  res.json(result)

})

exports.order = functions.region('asia-northeast1').https.onCall(async (params, context) => {
  console.log("order start ")
  const order = params.order
  const now = new Date().getTime()
  const assetNameArray = Object.keys(config.contract[project]).filter((key) => {
    return config.contract[project][key] === order.asset
  });
  order.assetName= assetNameArray[0]
  const orderPricefromWei = web3.utils.fromWei(order.price)
  order.price_sort = web3.utils.padLeft(order.price, 36)


  //検証ブロック
  /*[TODO]
  * referral付近に変更あり()
  * assetステータスの検証()
  * - makerが自身が保持しているか
  * - approveが済んでいるか
  * - できていなかったらreturn
  */
 console.log("検証ブロック")
 if(order.referralRatio > 100) return

  if(!validateAssetStatus(order)){
    return
  }

  const hash = await bazaaar.methods
    .requireValidOrder_(
      [order.proxy, order.maker, order.taker, order.creatorRoyaltyRecipient, order.asset],
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

  //取得ブロック(API)
  /*[TODO]
   * contractAddressを入れればアセットの名が帰ってくるfunctionの作成(OK)
   * symbolからassetNameを取れるかも(OK)
   * OGP, msgのpramsの作成(symbolで分岐処理をする)(ok)
   * sellの条件分岐（ アートエディットがない場合売れない） をする(OK)
   */
  //
  console.log("取得ブロック API")
  const metadata = await getAssetMetadataByAssetId(asset, order.id)
  if ((asset == "mchh" || asset == "mche") && !metadata.sell) return

  const imagePromise = axios.get(metadata.image_url, {
    responseType: 'arraybuffer'
  })
  const promises = [readFile('./assets/img/bg1.png'), imagePromise]
  const resolved = await Promise.all(promises)

  //取得ブロック(OGP)
  /*[TODO]
   * asset、文字の大きさをconfigで制御する(ok)
   *
   *
   */
  console.log("取得ブロック OGP")
  const templateImg = new Canvas.Image()
  const characterImg = new Canvas.Image()
  templateImg.src = resolved[0]
  characterImg.src = resolved[1].data
  const canvas = Canvas.createCanvas(1200, 630)
  const c = canvas.getContext('2d')
  c.clearRect(0, 0, 1200, 630)
  c.drawImage(templateImg, 0, 0)
  c.drawImage(characterImg, config.ogp[asset].dx, config.ogp[asset].dy, config.ogp[asset].dw, config.ogp[asset].dh)

  if (asset == "mchh" && metadata.mch_artedit) {
    const arteditImg = new Canvas.Image()
    const art_url = 'https://www.mycryptoheroes.net/arts/' + metadata.extra_data.current_art
    const load_art = await axios.get(art_url, {
      responseType: 'arraybuffer'
    })
    arteditImg.src = load_art.data
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
      const msg = params.msg.replace(/\r?\n/g, '')
      c.fillText(msg, 840, 120, 720)
    } else {
      const msg = params.msg.replace(/\r?\n/g, '')
      c.fillText(msg.substr(0, 9), 840, 80, 720)
      c.fillText(msg.substr(9, 9), 840, 160, 720)
    }
  }
  c.fillStyle = '#fff'
  c.font = "40px 'Noto Sans JP'"

  switch (asset) {
    case 'ck':
      c.fillText('Id.' + order.id + ' / ' + 'Gen.' + metadata.generation, 840, 255, 720)
      c.fillText(coolDownIndexToSpeed(metadata.status.cooldown_index), 840, 305, 720)
      break
    case 'ctn':
      c.fillText('Id.' + order.id + ' / ' + 'Gen.' + metadata.generation, 840, 255, 720)
      c.fillText(coolDownIndexToSpeed(metadata.status.cooldown_index), 840, 305, 720)
      break
    case 'mchh':
      c.fillText(metadata.attributes.hero_name + ' / ' + 'Lv.' + metadata.attributes.lv, 840, 255, 720)
      c.fillText(metadata.attributes.rarity, 840, 305, 720)
      break
    case 'mche':
      c.fillText(metadata.attributes.extension_name + ' / ' + 'Lv.' + metadata.attributes.lv, 840, 255, 720)
      c.fillText(metadata.attributes.rarity, 840, 305, 720)
      break
  }

  c.font = "bold 75px 'Noto Sans JP Bold'"
  c.fillText(orderPricefromWei + ' ETH', 840, 375, 720)
  const base64EncodedImageString = canvas.toDataURL().substring(22)
  const imageBuffer = Buffer.from(base64EncodedImageString, 'base64')
  const file = bucket.file(hash + '.png')
  const ogp =
    'https://firebasestorage.googleapis.com/v0/b/' +
    bucket.name +
    '/o/' +
    encodeURIComponent(hash + '.png') +
    '?alt=media'
  order.hash = hash
  order.metadata = metadata
  order.ogp = ogp
  order.created = now
  order.valid = true

  //更新ブロック
  /*[TODO]
   * deactivateDocOGPをDB Update triggerで起動するように変更()
   *
   */
  console.log("更新ブロック")
  const batch = db.batch()
  const deactivateDocOGPPromises = []
  const snapshots = await db
    .collection('order')
    .where('maker', '==', order.maker)
    .where('asset', '==', order.asset)
    .where('id', '==', order.id)
    .where('valid', '==', true)
    .get()
  snapshots.forEach(function (doc) {
    const ref = db.collection('order').doc(doc.id)
    batch.update(ref, {
      result: {
        status: 'cancelled'
      },
      valid: false,
      modified: now
    })
    deactivateDocOGPPromises.push(deactivateDocOGP(doc.data()))
  })
  const ref = db.collection('order').doc(hash)
  batch.set(ref, order)
  const savePromises = [
    file.save(imageBuffer, {
      metadata: {
        contentType: 'image/png'
      }
    }),
    batch.commit()
  ]
  await Promise.all(savePromises.concat(deactivateDocOGPPromises))

  //書込ブロック
  /*[TODO]
   * 取得ブロック(API)で作成したmsgをdataに入れる仕様にする(ok)
   */
  console.log("書込ブロック")
  let msg
  switch (asset) {
    case 'ck':
      msg = 'NOW ON SALE!!' + ' / Id.' + order.id + ' / Gen.' + metadata.generation + ' / ' + coolDownIndexToSpeed(metadata.status.cooldown_index) + ' / #CryptoKitties '
      break
    case 'ctn':
      msg = 'NOW ON SALE!!' + ' / Id.' + order.id + ' / Gen.' + metadata.generation + ' / ' + coolDownIndexToSpeed(metadata.status.cooldown_index) + ' / #くりぷ豚 '
      break
    case 'mchh':
      msg = 'NOW ON SALE!!' + ' / ' + metadata.attributes.hero_name + ' / Lv.' + metadata.attributes.lv + ' / ' + metadata.attributes.rarity + ' / #MCH '
      break
    case 'mche':
      msg = 'NOW ON SALE!!' + ' / ' + metadata.attributes.extension_name + ' / Lv.' + metadata.attributes.lv + ' / ' + metadata.attributes.rarity + ' / #MCH '
      break
  }

  await axios({
    method: 'post',
    url: 'https://discordapp.com/api/webhooks/' + process.env.DISCORD_WEBHOOK,
    data: {
      content: msg + config.discord.endpoint[project] + `${asset}/order/` + hash
    }
  })

  const result = {
    ogp: ogp,
    hash: hash
  }
  return result
})

exports.orderPeriodicUpdatePubSub = functions
  .region('asia-northeast1')
  .pubsub.topic('orderPeriodicUpdate')
  .onPublish(async message => {
    const blockNum = (await web3.eth.getBlockNumber()) - 25
    const eventPromises = [
      bazaaar.getPastEvents('OrderMatched', {
        fromBlock: blockNum,
        toBlock: 'latest'
      }),
      bazaaar.getPastEvents('OrderCancelled', {
        fromBlock: blockNum,
        toBlock: 'latest'
      })
    ]
    const eventResolved = await Promise.all(eventPromises)
    const batch = db.batch()
    const takers = []
    const soldPromises = []
    const cancelledPromises = []
    const now = new Date().getTime()
    for (let i = 0; i < eventResolved[0].length; i++) {
      takers.push(eventResolved[0][i].returnValues.taker)
      soldPromises.push(
        db
          .collection('order')
          .where('hash', '==', eventResolved[0][i].raw.topics[1])
          .where('valid', '==', true)
          .get()
      )
    }
    for (let i = 0; i < eventResolved[1].length; i++) {
      cancelledPromises.push(
        db
          .collection('order')
          .where('asset', '==', eventResolved[1][i].returnValues.asset)
          .where('id', '==', eventResolved[1][i].returnValues.id.toString())
          .where('maker', '==', eventResolved[1][i].returnValues.maker)
          .where('valid', '==', true)
          .get()
      )
    }
    const promiseArray = [soldPromises, cancelledPromises]
    const orderResolved = await Promise.all(
      promiseArray.map(function (innerPromiseArray) {
        return Promise.all(innerPromiseArray)
      })
    )

    const processed = []
    for (let i = 0; i < orderResolved[0].length; i++) {
      orderResolved[0][i].forEach(function (doc) {
        processed.push(doc.id)
        let ref = db.collection('order').doc(doc.id)
        batch.update(ref, {
          result: {
            status: 'sold',
            taker: takers[i]
          },
          valid: false,
          modified: now
        })
      })
    }
    for (let i = 0; i < orderResolved[1].length; i++) {
      orderResolved[1][i].forEach(function (doc) {
        if (!processed.includes(doc.id)) {
          let ref = db.collection('order').doc(doc.id)
          batch.update(ref, {
            result: {
              status: 'cancelled'
            },
            valid: false,
            modified: now
          })
        }
      })
    }
    await batch.commit()
  })

exports.orderCleaningPubSub = functions
  .region('asia-northeast1')
  .pubsub.topic('orderCleaning')
  .onPublish(async message => {
    const now = new Date().getTime()
    const snapshots = await db
      .collection('order')
      .where('valid', '==', true)
      .get()
    const docs = []
    snapshots.forEach(async doc => {
      docs.push(doc.id)
    })

    for (let i = 0; i < docs.length; i++) {
      const record = await db
        .collection('order')
        .doc(docs[i])
        .get()
      const order = record.data()
      try {
        const hash = await bazaaar.methods
          .requireValidOrder_(
            [order.proxy, order.maker, order.taker, order.creatorRoyaltyRecipient, order.asset],
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
        if (hash != order.hash) {
          console.info('deactivate: ' + docs[i])
          await db
            .collection('order')
            .doc(docs[i])
            .update({
              result: {
                status: 'cancelled'
              },
              valid: false,
              modified: now
            })
          await deactivateDocOGP(order)
        }
      } catch (err) {
        console.info('deactivate: ' + docs[i])
        await db
          .collection('order')
          .doc(docs[i])
          .update({
            result: {
              status: 'cancelled'
            },
            valid: false,
            modified: now
          })
        await deactivateDocOGP(order)
      }
    }
  })

exports.api = functions.region('asia-northeast1').https.onCall(async (params, context) => {
  /*[TODO]
   * db内にアセットのシンボル追加する(OK)
   * アセット毎に取得出来るようにする(後日行う)
   *
   */
  const result = []
  const limit = Number(params.limit)
  if (limit > 300) {
    limit = 300
  }
  const snapshots = await db
    .collection('order')
    .where('valid', '==', true)
    .orderBy('created', 'desc')
    .limit(limit)
    .get()

  snapshots.forEach(function (doc) {
    const order = doc.data()
    const data = {
      price: order.price,
      id: order.id,
      name: order.metadata.name,
      image: order.metadata.image_url,
      ogp: order.ogp,
      url: config.host[project] + order.symbol + '/order/' + order.hash
    }
    result.push(data)
  })
  return result
})

exports.deactivateOrderImageOnOrderChange = functions.region('asia-northeast1').firestore.document('order/{hash}').onUpdate(async (change, context) => {
  const previous = change.before.data()
  const doc = change.after.data()

  if (!previous.valid || doc.valid) return

  const canvas = Canvas.createCanvas(1200, 630)
  const c = canvas.getContext('2d')

  const imagePromise = axios.get(doc.ogp, {
    responseType: 'arraybuffer'
  })
  promises = [imagePromise, readFile('./assets/img/out_en.png')]

  const resolved = await Promise.all(promises)
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
  file.save(imageBuffer, {
    metadata: {
      contentType: 'image/png'
    }
  })
})

//------------------------------- special ------------------------------- //
exports.spArteditUserSign = functions.region('asia-northeast1').https.onCall(async (params, context) => {
  const msg = web3.utils.utf8ToHex(
    'この署名を行うと、マイクリプトヒーローズ内で設定されているあなたの作成したアートエディットが、bazaaar内で表示されるようになります。またアセットの売買が発生した際に取引手数料の分配を受け取ることができます。'
  )
  const address = web3.eth.accounts.recover(msg, params.sig)
  if (address == params.address) {
    await db
      .collection('user')
      .doc(address)
      .set({
        mch_artedit: params.status,
        modified: params.modified
      })
  }
  return address == params.address
})
