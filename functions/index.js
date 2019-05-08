const config = require('./config.json')
const project = process.env.PROJECT
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
const bazaaar_v1 = new web3.eth.Contract(config.abi.bazaaar_v1, config.contract[project].bazaaar_v1)
const bazaaar_v2 = new web3.eth.Contract(config.abi.bazaaar_v2, config.contract[project].bazaaar_v2)
const bazaaar_v3 = new web3.eth.Contract(config.abi.bazaaar_v3, config.contract[project].bazaaar_v3)
const ctn = new web3.eth.Contract(config.abi.ctn, config.contract[project].ctn)

const twitter = require('twitter')
const client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESSTOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESSTOKEN_SECRET
})

const coolDownIndexToSpeed = index => {
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

const deactivateDocOGP = async doc => {
  console.info('START deactivateDocOGP')
  const canvas = Canvas.createCanvas(1200, 630)
  const c = canvas.getContext('2d')
  const imagePromise = axios.get(doc.ogp, {
    responseType: 'arraybuffer'
  })
  const promises = [imagePromise, readFile('./assets/img/out_en.png')]
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
  const file = bucket.file(doc.hash + '.png')
  await file.save(imageBuffer, {
    metadata: {
      contentType: 'image/png'
    }
  })
  console.info('END deactivateDocOGP')
}

const {
  google
} = require('googleapis')
const cloudbilling = google.cloudbilling('v1')
const {
  auth
} = require('google-auth-library')
const PROJECT_NAME = `projects/${config.billion[project]}`

exports.subscribe = event => {
  console.log(event)
  console.log(event.data)
  const pubsubData = JSON.parse(Buffer.from(event.data, 'base64').toString())
  if (pubsubData.costAmount <= pubsubData.budgetAmount) {
    console.log('INFO 1')
    return Promise.resolve('No action shall be taken on current cost ' + pubsubData.costAmount)
  }
  console.log('INFO 2')
  return setAuthCredential()
    .then(() => isBillingEnabled(PROJECT_NAME))
    .then(enabled => {
      if (enabled) {
        console.log('INFO 3')
        return disableBillingForProject(PROJECT_NAME)
      }
      console.log('INFO 4')
      return Promise.resolve('Billing already in disabled state')
    })
}

/**
 * @return {Promise} Credentials set globally
 */
function setAuthCredential() {
  console.log('INFO 5')
  return auth.getApplicationDefault().then(res => {
    let client2 = res.credential
    console.log('INFO 6')
    if (client2.createScopedRequired && client2.createScopedRequired()) {
      console.log('INFO 7')
      client2 = client2.createScoped(['https://www.googleapis.com/auth/cloud-billing'])
    }
    console.log('INFO 8')
    // Set credential globally for all requests
    google.options({
      auth: client2
    })
  })
}

/**
 * @param {string} projectName Name of project to check if billing is enabled
 * @return {Promise} Whether project has billing enabled or not
 */
function isBillingEnabled(projectName) {
  console.log('INFO 9')
  return cloudbilling.projects
    .getBillingInfo({
      name: projectName
    })
    .then(res => res.data.billingEnabled)
}

/**
 * @param {string} projectName Name of project disable billing on
 * @return {Promise} Text containing response from disabling billing
 */
function disableBillingForProject(projectName) {
  console.log('INFO 10')
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

//処理が被っているところは関数化、それ以外は関数化しない方針
async function getAssetMetadataByAssetId(asset, id) {
  let result
  let response

  switch (asset) {
    case 'ck':
      response = await axios.get(config.api.ck.metadata + id, {
        headers: {
          'x-api-token': config.token.kitty
        }
      })
      result = response.data
      break
    case 'ctn':
      response = await axios.get(config.api.ctn.metadata + id + '.json')
      result = response.data
      break
    case 'mchh':
      let general = await axios.get(config.api.mch.metadata + 'hero/' + id)
      response = general.data
      let promises = []
      promises.push(axios.get(config.api.mch.metadata + 'heroType/' + general.data.extra_data.hero_type))
      promises.push(axios.get(config.api.mch.metadata + 'skill/' + general.data.extra_data.active_skill_id))
      promises.push(axios.get(config.api.mch.metadata + 'skill/' + general.data.extra_data.passive_skill_id))
      if (general.data.extra_data.current_art) {
        promises.push(axios.get(config.api.mch.metadata + 'ipfs/' + general.data.extra_data.current_art))
      }
      let resolved = await Promise.all(promises)
      response.hero_type = resolved[0].data
      response.active_skill = resolved[1].data
      response.passive_skill = resolved[2].data

      if (general.data.extra_data.art_history.length > 0) {
        response.sell = true
      } else {
        response.sell = false
      }
      response.mch_artedit = false
      response.royalty_rate = 0

      if (resolved.length < 4) break

      response.current_art_data = resolved[3].data
      if (!response.current_art_data.attributes.editor_address) break
      const editor_address = web3.utils.toChecksumAddress(response.current_art_data.attributes.editor_address)
      const doc = await db
        .collection('user')
        .doc(editor_address)
        .get()
      if (!doc.exists) break
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
      let general = await axios.get(config.api.mch.metadata + 'extension/' + id)
      response = general.data
      let promises = []
      promises.push(axios(config.api.mch.metadata + 'extensionType/' + general.data.extra_data.extension_type))
      promises.push(axios(config.api.mch.metadata + 'skill/' + general.data.extra_data.skill_id))
      let resolved = await Promise.all(promises)

      console.log('START response')
      response.extension_type = resolved[0].data
      response.skill = resolved[1].data

      if (general.data.extra_data.nickname) {
        response.sell = true
      } else {
        response.sell = false
      }

      result = response
      break
  }
  return result
}

exports.metadata = functions.region('asia-northeast1').https.onCall(async (data, context) => {
  console.log('asset:' + data.asset)
  console.log('id:' + data.id)
  return await metadata(data.asset, data.id)
})

exports.order = functions.region('asia-northeast1').https.onCall(async (params, context) => {
  const order = params.order
  const now = new Date().getTime()
  const orderPricefromWei = web3.utils.fromWei(order.price)
  order.price_sort = web3.utils.padLeft(order.price, 36)

  //検証ブロック
  /*[TODO]
   * referral付近に変更あり
   * assetステータスの検証
   *
   */
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

  const assetName = await Object.keys(config.contract[project]).filter((key) => {
    return config.contract[project][key] === order.asset
  });
  const asset = assetName[0]

  const metadata = await getAssetMetadataByAssetId(asset, order.id)
  if ((asset == "mch" || asset == "mche") && !metadata.sell) return

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
  const templateImg = new Canvas.Image()
  const characterImg = new Canvas.Image()
  templateImg.src = resolved[0]
  characterImg.src = resolved[1].data
  const canvas = Canvas.createCanvas(1200, 630)
  const c = canvas.getContext('2d')
  c.clearRect(0, 0, 1200, 630)
  c.drawImage(templateImg, 0, 0)
  c.drawImage(characterImg, config.ogp[asset].dx, config.ogp[asset].dy, config.ogp[asset].dw, config.ogp[asset].dh)

  if (asset == "mch" && metadata.mch_artedit) {
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
    case 'mch':
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
   * deactivateDocOGPをDB Update triggerで起動するように変更
   *
   */
  const batch = db.batch()
  const deactivateDocOGPPromises = []
  const snapshots = await db
    .collection('order')
    .where('maker', '==', order.maker)
    .where('asset', '==', order.asset)
    .where('id', '==', order.id)
    .where('valid', '==', true)
    .get()
  console.info('INFO order 4')
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
   * 取得ブロック(API)で作成したmsgをdataに入れる仕様にする
   */
  await axios({
    method: 'post',
    url: 'https://discordapp.com/api/webhooks/' + process.env.DISCORD_WEBHOOK,
    data: {
      content: 'NOW ON SALE!!' +
        ' / Id.' +
        order.id +
        ' / Gen.' +
        metadata.generation +
        ' / ' +
        coolDownIndexToSpeed(metadata.status.cooldown_index) +
        ' / #CryptoKitties ' +
        config.discord.endpoint[project] +
        'ck/order/' +
        hash
    }
  })
  const result = {
    ogp: ogp,
    hash: hash
  }
  console.info('OUTPUT data')
  console.info(result)
  console.info('END order')
  return result

  // console.info("START order")
  // console.info("INPUT data")
  // console.info(params)
  // const order = params.order
  // order.price_sort = web3.utils.padLeft(order.price, 36)

  // if(order.asset == config.contract[project].ck) {
  //   const hash = await bazaaar_v1.methods
  //     .requireValidOrder_(
  //       [
  //         order.proxy,
  //         order.maker,
  //         order.taker,
  //         order.creatorRoyaltyRecipient,
  //         order.asset
  //       ],
  //       [
  //         order.id,
  //         order.price,
  //         order.nonce,
  //         order.salt,
  //         order.expiration,
  //         order.creatorRoyaltyRatio,
  //         order.referralRatio
  //       ],
  //       order.v,
  //       order.r,
  //       order.s
  //     )
  //     .call()
  //   console.info("INFO order 1")
  //   const response = await axios({
  //     method: 'get',
  //     url: config.api.ck.metadata + order.id,
  //     headers: {'x-api-token': config.token.kitty},
  //     responseType: 'json'
  //   })
  //   console.info("INFO order 2")
  //   const metadata = response.data
  //   const imagePromise = axios.get(metadata.image_url_png, {
  //     responseType: 'arraybuffer'
  //   })
  //   const promises = [readFile('./assets/img/bg1.png'), imagePromise]
  //   const resolved = await Promise.all(promises)
  //   console.info("INFO order 3")
  //   const templateImg = new Canvas.Image()
  //   const characterImg = new Canvas.Image()
  //   templateImg.src = resolved[0]
  //   characterImg.src = resolved[1].data
  //   const canvas = Canvas.createCanvas(1200, 630)
  //   const c = canvas.getContext('2d')
  //   c.clearRect(0, 0, 1200, 630)
  //   c.drawImage(templateImg, 0, 0)
  //   c.drawImage(characterImg, 15, 90, 450, 450)
  //   c.textBaseline = 'top'
  //   c.textAlign = 'center'
  //   c.fillStyle = '#ffff00'
  //   c.font = "bold 60px 'Noto Sans JP Bold'"
  //   if (!params.msg) {
  //     c.fillText('NOW ON SALE!!', 840, 120, 720)
  //   } else {
  //     if(params.msg.length <= 9){
  //       const msg = params.msg.replace(/\r?\n/g, '')
  //       c.fillText(msg, 840, 120, 720)
  //     } else {
  //       const msg = params.msg.replace(/\r?\n/g, '')
  //       c.fillText(msg.substr(0, 9), 840, 80, 720)
  //       c.fillText(msg.substr(9, 9), 840, 160, 720)
  //     }
  //   }
  //   c.fillStyle = '#fff'
  //   c.font = "40px 'Noto Sans JP'"
  //   c.fillText(
  //     'Id.' + order.id + ' / ' + 'Gen.' + metadata.generation,
  //     840,
  //     255,
  //     720
  //   )
  //   c.fillText(coolDownIndexToSpeed(metadata.status.cooldown_index), 840, 305, 720)
  //   c.font = "bold 75px 'Noto Sans JP Bold'"
  //   c.fillText(web3.utils.fromWei(order.price) + ' ETH', 840, 375, 720)
  //   const base64EncodedImageString = canvas.toDataURL().substring(22)
  //   const imageBuffer = Buffer.from(base64EncodedImageString, 'base64')
  //   const file = bucket.file(hash + '.png')
  //   const ogp =
  //     'https://firebasestorage.googleapis.com/v0/b/' +
  //     bucket.name +
  //     '/o/' +
  //     encodeURIComponent(hash + '.png') +
  //     '?alt=media'
  //   const now = new Date().getTime()
  //   order.hash = hash
  //   order.metadata = metadata
  //   order.ogp = ogp
  //   order.created = now
  //   order.valid = true
  //   const batch = db.batch()
  //   const deactivateDocOGPPromises = []
  //   const snapshots = await db
  //     .collection('order')
  //     .where('maker', '==', order.maker)
  //     .where('asset', '==', order.asset)
  //     .where('id', '==', order.id)
  //     .where('valid', '==', true)
  //     .get()
  //   console.info("INFO order 4")
  //   snapshots.forEach(function(doc) {
  //     const ref = db.collection('order').doc(doc.id)
  //     batch.update(ref, {
  //       result: { status: 'cancelled' },
  //       valid: false,
  //       modified: now
  //     })
  //     deactivateDocOGPPromises.push(deactivateDocOGP(doc.data()))
  //   })
  //   const ref = db.collection('order').doc(hash)
  //   batch.set(ref, order)
  //   const savePromises = [
  //     file.save(imageBuffer, { metadata: { contentType: 'image/png' } }),
  //     batch.commit()
  //   ]
  //   await Promise.all(savePromises.concat(deactivateDocOGPPromises))
  //   console.info("INFO order 5")
  //   const msssage =
  //     'NOW ON SALE!!' +
  //     ' / Id.' +
  //     order.id +
  //     ' / Gen.' +
  //     metadata.generation +
  //     ' / ' +
  //     coolDownIndexToSpeed(metadata.status.cooldown_index) +
  //     ' / #bazaaar #バザー #NFT #CryptoKitties from @bazaaario ' +
  //     config.host[project] +
  //     'ck/order/' +
  //     order.hash
  //   // try{
  //   //   client.post('statuses/update', { status: msssage }, (error, tweet, response) => {
  //   //     if(error) {
  //   //       console.info('Twitter API Down')
  //   //     }
  //   //   })
  //   // } catch (err) {
  //   //   console.info('Twitter API Down')
  //   // }
  //   // client.post('statuses/update', { status: msssage }, (error, tweet, response) => {
  //   //   if(error) throw error;
  //   // });
  //   // await axios({
  //   //   method:'post',
  //   //   url: "https://discordapp.com/api/webhooks/" + process.env.DISCORD_WEBHOOK,
  //   //   data: {
  //   //     content:
  //   //       'NOW ON SALE!!' +
  //   //       ' / Id.' +
  //   //       order.id +
  //   //       ' / Gen.' +
  //   //       metadata.generation +
  //   //       ' / ' +
  //   //       coolDownIndexToSpeed(metadata.status.cooldown_index) +
  //   //       ' / #CryptoKitties ' +
  //   //       config.discord.endpoint[project] +
  //   //       "ck/order/" +
  //   //       hash
  //   //   }
  //   // })
  //   const result = {
  //     ogp: ogp,
  //     hash: hash
  //   }
  //   console.info("OUTPUT data")
  //   console.info(result)
  //   console.info("END order")
  //   return result
  // } else if (order.asset == config.contract[project].ctn) {
  //   const hash = await bazaaar_v2.methods
  //     .requireValidOrder_(
  //       [
  //         order.proxy,
  //         order.maker,
  //         order.taker,
  //         order.creatorRoyaltyRecipient,
  //         order.asset
  //       ],
  //       [
  //         order.id,
  //         order.price,
  //         order.nonce,
  //         order.salt,
  //         order.expiration,
  //         order.creatorRoyaltyRatio,
  //         order.referralRatio
  //       ],
  //       order.v,
  //       order.r,
  //       order.s
  //     )
  //     .call()
  //   console.info("INFO order 1")
  //   const response = await axios({
  //     method: 'get',
  //     url: config.api.ctn.metadata + order.id + '.json',
  //     responseType: 'json'
  //   })
  //   console.info("INFO order 2")
  //   let metadata = response.data
  //   const entities = await ctn.methods.getEntity(order.id).call()
  //   console.log(entities)
  //   metadata.image_url = metadata.image
  //   metadata.generation = await entities.generation
  //   metadata.status = {}
  //   metadata.status.cooldown_index = await Number(entities.cooldownIndex)
  //   console.log(metadata.status.cooldown_index)
  //   const imagePromise = axios.get(metadata.image_url, {
  //     responseType: 'arraybuffer'
  //   })
  //   const promises = [readFile('./assets/img/bg1.png'), imagePromise]
  //   const resolved = await Promise.all(promises)
  //   console.info("INFO order 3")
  //   const templateImg = new Canvas.Image()
  //   const characterImg = new Canvas.Image()
  //   templateImg.src = resolved[0]
  //   characterImg.src = resolved[1].data
  //   const canvas = Canvas.createCanvas(1200, 630)
  //   const c = canvas.getContext('2d')
  //   c.clearRect(0, 0, 1200, 630)
  //   c.drawImage(templateImg, 0, 0)
  //   c.drawImage(characterImg, 15, 50, 450, 515)
  //   c.textBaseline = 'top'
  //   c.textAlign = 'center'
  //   c.fillStyle = '#ffff00'
  //   c.font = "bold 60px 'Noto Sans JP Bold'"
  //   if (!params.msg) {
  //     c.fillText('NOW ON SALE!!', 840, 120, 720)
  //   } else {
  //     if(params.msg.length <= 9){
  //       const msg = params.msg.replace(/\r?\n/g, '')
  //       c.fillText(msg, 840, 120, 720)
  //     } else {
  //       const msg = params.msg.replace(/\r?\n/g, '')
  //       c.fillText(msg.substr(0, 9), 840, 80, 720)
  //       c.fillText(msg.substr(9, 9), 840, 160, 720)
  //     }
  //   }
  //   c.fillStyle = '#fff'
  //   c.font = "40px 'Noto Sans JP'"
  //   c.fillText(
  //     'Id.' + order.id + ' / ' + 'Gen.' + metadata.generation,
  //     840,
  //     255,
  //     720
  //   )
  //   c.fillText(coolDownIndexToSpeed(metadata.status.cooldown_index), 840, 305, 720)
  //   c.font = "bold 75px 'Noto Sans JP Bold'"
  //   c.fillText(web3.utils.fromWei(order.price) + ' ETH', 840, 375, 720)
  //   const base64EncodedImageString = canvas.toDataURL().substring(22)
  //   const imageBuffer = Buffer.from(base64EncodedImageString, 'base64')
  //   const file = bucket.file(hash + '.png')
  //   const ogp =
  //     'https://firebasestorage.googleapis.com/v0/b/' +
  //     bucket.name +
  //     '/o/' +
  //     encodeURIComponent(hash + '.png') +
  //     '?alt=media'
  //   const now = new Date().getTime()
  //   order.hash = hash
  //   order.metadata = metadata
  //   order.ogp = ogp
  //   order.created = now
  //   order.valid = true
  //   const batch = db.batch()
  //   const deactivateDocOGPPromises = []
  //   const snapshots = await db
  //     .collection('order')
  //     .where('maker', '==', order.maker)
  //     .where('asset', '==', order.asset)
  //     .where('id', '==', order.id)
  //     .where('valid', '==', true)
  //     .get()
  //   console.info("INFO order 4")
  //   snapshots.forEach(function(doc) {
  //     const ref = db.collection('order').doc(doc.id)
  //     batch.update(ref, {
  //       result: { status: 'cancelled' },
  //       valid: false,
  //       modified: now
  //     })
  //     deactivateDocOGPPromises.push(deactivateDocOGP(doc.data()))
  //   })
  //   const ref = db.collection('order').doc(hash)
  //   batch.set(ref, order)
  //   const savePromises = [
  //     file.save(imageBuffer, { metadata: { contentType: 'image/png' } }),
  //     batch.commit()
  //   ]
  //   await Promise.all(savePromises.concat(deactivateDocOGPPromises))
  //   console.info("INFO order 5")
  //   const msssage =
  //     'NOW ON SALE!!' +
  //     ' / Id.' +
  //     order.id +
  //     ' / Gen.' +
  //     metadata.generation +
  //     ' / ' +
  //     coolDownIndexToSpeed(metadata.status.cooldown_index) +
  //     ' / #bazaaar #バザー #NFT #くりぷ豚 from @bazaaario ' +
  //     config.host[project] +
  //     'ctn/order/' +
  //     order.hash
  //   // try{
  //   //   client.post('statuses/update', { status: msssage }, (error, tweet, response) => {
  //   //     if(error) {
  //   //       console.info('Twitter API Down')
  //   //     }
  //   //   })
  //   // } catch (err) {
  //   //   console.info('Twitter API Down')
  //   // }
  //   // await axios({
  //   //   method:'post',
  //   //   url: "https://discordapp.com/api/webhooks/" + process.env.DISCORD_WEBHOOK,
  //   //   data: {
  //   //     content:
  //   //       'NOW ON SALE!!' +
  //   //       ' / Id.' +
  //   //       order.id +
  //   //       ' / Gen.' +
  //   //       metadata.generation +
  //   //       ' / ' +
  //   //       coolDownIndexToSpeed(metadata.status.cooldown_index) +
  //   //       ' / #くりぷ豚 ' +
  //   //       config.discord.endpoint[project] +
  //   //       "ctn/order/" +
  //   //       hash
  //   //   }
  //   // })
  //   const result = {
  //     ogp: ogp,
  //     hash: hash
  //   }
  //   console.info("OUTPUT data")
  //   console.info(result)
  //   console.info("END order")
  //   return result
  // } else if (order.asset == config.contract[project].mchh) {
  //   const hash = await bazaaar_v3.methods
  //     .requireValidOrder_(
  //       [
  //         order.proxy,
  //         order.maker,
  //         order.taker,
  //         order.creatorRoyaltyRecipient,
  //         order.asset
  //       ],
  //       [
  //         order.id,
  //         order.price,
  //         order.nonce,
  //         order.salt,
  //         order.expiration,
  //         order.creatorRoyaltyRatio,
  //         order.referralRatio
  //       ],
  //       order.v,
  //       order.r,
  //       order.s
  //     )
  //     .call()

  //   console.info("INFO order 1")
  //   console.log(order.id)
  //   const meta = await metadata('mchh', order.id)
  //   console.info("INFO order 2")
  //   const imagePromise = axios.get(meta.image_url, {
  //     responseType: 'arraybuffer'
  //   })
  //   const promises = [readFile('./assets/img/bg1.png'), imagePromise]
  //   const resolved = await Promise.all(promises)
  //   console.info("INFO order 3")
  //   const templateImg = new Canvas.Image()
  //   const characterImg = new Canvas.Image()
  //   templateImg.src = resolved[0]
  //   characterImg.src = resolved[1].data
  //   const canvas = Canvas.createCanvas(1200, 630)
  //   const c = canvas.getContext('2d')
  //   c.clearRect(0, 0, 1200, 630)
  //   c.drawImage(templateImg, 0, 0)
  //   c.drawImage(characterImg, 15, 90, 450, 450)
  //   if(meta.mch_artedit){
  //     const arteditImg = new Canvas.Image()
  //     const art_url ='https://www.mycryptoheroes.net/arts/' + meta.extra_data.current_art
  //     const load_art = await axios.get(art_url, {
  //       responseType: 'arraybuffer'
  //     })
  //     arteditImg.src = load_art.data
  //     c.drawImage(arteditImg, 15, 400, 150, 150)
  //   }
  //   c.textBaseline = 'top'
  //   c.textAlign = 'center'
  //   c.fillStyle = '#ffff00'
  //   c.font = "bold 60px 'Noto Sans JP Bold'"
  //   if (!params.msg) {
  //     c.fillText('NOW ON SALE!!', 840, 120, 720)
  //   } else {
  //     if(params.msg.length <= 9){
  //       const msg = params.msg.replace(/\r?\n/g, '')
  //       c.fillText(msg, 840, 120, 720)
  //     } else {
  //       const msg = params.msg.replace(/\r?\n/g, '')
  //       c.fillText(msg.substr(0, 9), 840, 80, 720)
  //       c.fillText(msg.substr(9, 9), 840, 160, 720)
  //     }
  //   }
  //   c.fillStyle = '#fff'
  //   c.font = "40px 'Noto Sans JP'"
  //   c.fillText(
  //     meta.attributes.hero_name + ' / ' + 'Lv.' + meta.attributes.lv,
  //     840,
  //     255,
  //     720
  //   )
  //   c.fillText(meta.attributes.rarity, 840, 305, 720)
  //   c.font = "bold 75px 'Noto Sans JP Bold'"
  //   c.fillText(web3.utils.fromWei(order.price) + ' ETH', 840, 375, 720)
  //   const base64EncodedImageString = canvas.toDataURL().substring(22)
  //   const imageBuffer = Buffer.from(base64EncodedImageString, 'base64')
  //   const file = bucket.file(hash + '.png')
  //   const ogp =
  //     'https://firebasestorage.googleapis.com/v0/b/' +
  //     bucket.name +
  //     '/o/' +
  //     encodeURIComponent(hash + '.png') +
  //     '?alt=media'
  //   const now = new Date().getTime()
  //   order.hash = hash
  //   order.metadata = meta
  //   order.ogp = ogp
  //   order.created = now
  //   order.valid = true
  //   const batch = db.batch()
  //   const deactivateDocOGPPromises = []
  //   const snapshots = await db
  //     .collection('order')
  //     .where('maker', '==', order.maker)
  //     .where('asset', '==', order.asset)
  //     .where('id', '==', order.id)
  //     .where('valid', '==', true)
  //     .get()
  //   console.info("INFO order 4")
  //   snapshots.forEach(function(doc) {
  //     const ref = db.collection('order').doc(doc.id)
  //     batch.update(ref, {
  //       result: { status: 'cancelled' },
  //       valid: false,
  //       modified: now
  //     })
  //     deactivateDocOGPPromises.push(deactivateDocOGP(doc.data()))
  //   })
  //   const ref = db.collection('order').doc(hash)
  //   batch.set(ref, order)
  //   const savePromises = [
  //     file.save(imageBuffer, { metadata: { contentType: 'image/png' } }),
  //     batch.commit()
  //   ]
  //   await Promise.all(savePromises.concat(deactivateDocOGPPromises))
  //   console.info("INFO order 5")
  //   const msssage =
  //     'NOW ON SALE!!' +
  //     ' / ' +
  //     meta.attributes.hero_name +
  //     ' / Lv.' +
  //     meta.attributes.lv +
  //     ' / ' +
  //     meta.attributes.rarity +
  //     ' / #bazaaar #バザー #NFT #MCH #マイクリ from @bazaaario ' +
  //     config.host[project] +
  //     'mchh/order/' +
  //     order.hash
  //   // try{
  //   //   client.post('statuses/update', { status: msssage }, (error, tweet, response) => {
  //   //     if(error) {
  //   //       console.info('Twitter API Down')
  //   //     }
  //   //   })
  //   // } catch (err) {
  //   //   console.info('Twitter API Down')
  //   // }
  //   // await axios({
  //   //   method:'post',
  //   //   url: "https://discordapp.com/api/webhooks/" + process.env.DISCORD_WEBHOOK,
  //   //   data: {
  //   //     content:
  //   //       'NOW ON SALE!!' +
  //   //       ' / ' +
  //   //       meta.attributes.hero_name +
  //   //       ' / Lv.' +
  //   //       meta.attributes.lv +
  //   //       ' / ' +
  //   //       meta.attributes.rarity +
  //   //       ' / #MCH ' +
  //   //       config.discord.endpoint[project] +
  //   //       "mchh/order/" +
  //   //       hash
  //   //   }
  //   // })
  //   const result = {
  //     ogp: ogp,
  //     hash: hash
  //   }
  //   console.info("OUTPUT data")
  //   console.info(result)
  //   console.info("END order")
  //   return result
  // }else if (order.asset == config.contract[project].mche) {
  //   const hash = await bazaaar_v3.methods
  //     .requireValidOrder_(
  //       [
  //         order.proxy,
  //         order.maker,
  //         order.taker,
  //         order.creatorRoyaltyRecipient,
  //         order.asset
  //       ],
  //       [
  //         order.id,
  //         order.price,
  //         order.nonce,
  //         order.salt,
  //         order.expiration,
  //         order.creatorRoyaltyRatio,
  //         order.referralRatio
  //       ],
  //       order.v,
  //       order.r,
  //       order.s
  //     )
  //     .call()
  //   console.info("INFO order 1")
  //   const meta = await metadata('mche', order.id)
  //   console.info("INFO order 2")
  //   const imagePromise = axios.get(meta.image_url, {
  //     responseType: 'arraybuffer'
  //   })
  //   const promises = [readFile('./assets/img/bg1.png'), imagePromise]
  //   const resolved = await Promise.all(promises)
  //   console.info("INFO order 3")
  //   const templateImg = new Canvas.Image()
  //   const characterImg = new Canvas.Image()
  //   templateImg.src = resolved[0]
  //   characterImg.src = resolved[1].data
  //   const canvas = Canvas.createCanvas(1200, 630)
  //   const c = canvas.getContext('2d')
  //   c.clearRect(0, 0, 1200, 630)
  //   c.drawImage(templateImg, 0, 0)
  //   c.drawImage(characterImg, 15, 90, 450, 450)
  //   c.textBaseline = 'top'
  //   c.textAlign = 'center'
  //   c.fillStyle = '#ffff00'
  //   c.font = "bold 60px 'Noto Sans JP Bold'"
  //   if (!params.msg) {
  //     c.fillText('NOW ON SALE!!', 840, 120, 720)
  //   } else {
  //     if(params.msg.length <= 9){
  //       const msg = params.msg.replace(/\r?\n/g, '')
  //       c.fillText(msg, 840, 120, 720)
  //     } else {
  //       const msg = params.msg.replace(/\r?\n/g, '')
  //       c.fillText(msg.substr(0, 9), 840, 80, 720)
  //       c.fillText(msg.substr(9, 9), 840, 160, 720)
  //     }
  //   }
  //   c.fillStyle = '#fff'
  //   c.font = "40px 'Noto Sans JP'"
  //   c.fillText(
  //     meta.attributes.extension_name + ' / ' + 'Lv.' + meta.attributes.lv,
  //     840,
  //     255,
  //     720
  //   )
  //   c.fillText(meta.attributes.rarity, 840, 305, 720)
  //   c.font = "bold 75px 'Noto Sans JP Bold'"
  //   c.fillText(web3.utils.fromWei(order.price) + ' ETH', 840, 375, 720)
  //   const base64EncodedImageString = canvas.toDataURL().substring(22)
  //   const imageBuffer = Buffer.from(base64EncodedImageString, 'base64')
  //   const file = bucket.file(hash + '.png')
  //   const ogp =
  //     'https://firebasestorage.googleapis.com/v0/b/' +
  //     bucket.name +
  //     '/o/' +
  //     encodeURIComponent(hash + '.png') +
  //     '?alt=media'
  //   const now = new Date().getTime()
  //   order.hash = hash
  //   order.metadata = meta
  //   order.ogp = ogp
  //   order.created = now
  //   order.valid = true
  //   const batch = db.batch()
  //   const deactivateDocOGPPromises = []
  //   const snapshots = await db
  //     .collection('order')
  //     .where('maker', '==', order.maker)
  //     .where('asset', '==', order.asset)
  //     .where('id', '==', order.id)
  //     .where('valid', '==', true)
  //     .get()
  //   console.info("INFO order 4")
  //   snapshots.forEach(function(doc) {
  //     const ref = db.collection('order').doc(doc.id)
  //     batch.update(ref, {
  //       result: { status: 'cancelled' },
  //       valid: false,
  //       modified: now
  //     })
  //     deactivateDocOGPPromises.push(deactivateDocOGP(doc.data()))
  //   })
  //   const ref = db.collection('order').doc(hash)
  //   batch.set(ref, order)
  //   const savePromises = [
  //     file.save(imageBuffer, { metadata: { contentType: 'image/png' } }),
  //     batch.commit()
  //   ]
  //   await Promise.all(savePromises.concat(deactivateDocOGPPromises))
  //   console.info("INFO order 5")
  //   const msssage =
  //     'NOW ON SALE!!' +
  //     ' / ' +
  //     meta.attributes.extension_name +
  //     ' / Lv.' +
  //     meta.attributes.lv +
  //     ' / ' +
  //     meta.attributes.rarity +
  //     ' / #bazaaar #バザー #NFT #MCH #マイクリ from @bazaaario ' +
  //     config.host[project] +
  //     'mche/order/' +
  //     order.hash
  //   // try{
  //   //   client.post('statuses/update', { status: msssage }, (error, tweet, response) => {
  //   //     if(error) {
  //   //       console.info('Twitter API Down')
  //   //     }
  //   //   })
  //   // } catch (err) {
  //   //   console.info('Twitter API Down')
  //   // }
  //   // await axios({
  //   //   method:'post',
  //   //   url: "https://discordapp.com/api/webhooks/" + process.env.DISCORD_WEBHOOK,
  //   //   data: {
  //   //     content:
  //   //       'NOW ON SALE!!' +
  //   //       ' / ' +
  //   //       meta.attributes.extension_name +
  //   //       ' / Lv.' +
  //   //       meta.attributes.lv +
  //   //       ' / ' +
  //   //       meta.attributes.rarity +
  //   //       ' / #MCH ' +
  //   //       config.discord.endpoint[project] +
  //   //       "mche/order/" +
  //   //       hash
  //   //   }
  //   // })
  //   const result = {
  //     ogp: ogp,
  //     hash: hash
  //   }
  //   console.info("OUTPUT data")
  //   console.info(result)
  //   console.info("END order")
  //   return result
  // } else {
  //   console.info("Invalid Address")
  //   return
  // }
})
/*
exports.orderMatchedPubSub = functions
  .region('asia-northeast1')
  .pubsub.topic('orderMatched')
  .onPublish(async message => {
    console.info("START orderMatched")
    console.info("INPUT data:" + message.json)
    const transactionHash = message.json.transactionHash
    const transaction = await web3.eth.getTransactionReceipt(transactionHash)
    console.info("INFO orderMached 1")
    const hash = transaction.logs[0].topics[1]
    const address = web3.utils.toChecksumAddress(transaction.logs[0].address)
    const maker = web3.utils.toChecksumAddress(
      web3.utils.toHex(transaction.logs[0].data.substring(26, 66))
    )
    const taker = web3.utils.toChecksumAddress(
      web3.utils.toHex(transaction.logs[0].data.substring(90, 130))
    )
    const asset = web3.utils.toChecksumAddress(
      web3.utils.toHex(transaction.logs[0].data.substring(154, 194))
    )
    const id = web3.utils
      .hexToNumber(transaction.logs[0].data.substring(194, 258))
      .toString()
    const now = new Date().getTime()
    if (address == bazaaar_v1.options.address ||
        address == bazaaar_v2.options.address ||
        address == bazaaar_v3.options.address
    ){
      console.info("INFO orderMached 2")
      const batch = db.batch()
      const deactivateDocOGPPromises = []
      const promises = [
        db
          .collection('order')
          .where('hash', '==', hash)
          .where('valid', '==', true)
          .get(),
        db
          .collection('order')
          .where('maker', '==', maker)
          .where('asset', '==', asset)
          .where('id', '==', id)
          .where('valid', '==', true)
          .get()
      ]
      const resolved = await Promise.all(promises)
      console.info("INFO orderMached 3")
      resolved[0].forEach(function(doc) {
        let ref = db.collection('order').doc(doc.id)
        batch.update(ref, {
          result: { status: 'sold', taker: taker },
          valid: false,
          modified: now
        })
        deactivateDocOGPPromises.push(deactivateDocOGP(doc.data()))
      })
      resolved[1].forEach(function(doc) {
        if (doc.id != hash) {
          let ref = db.collection('order').doc(doc.id)
          batch.update(ref, {
            result: { status: 'cancelled' },
            valid: false,
            modified: now
          })
          deactivateDocOGPPromises.push(deactivateDocOGP(doc.data()))
        }
      })
      const savePromises = [batch.commit()]
      await Promise.all(savePromises.concat(deactivateDocOGPPromises))
    }
    console.info("END orderMached")
  })

exports.orderCancelledPubSub = functions
  .region('asia-northeast1')
  .pubsub.topic('orderCancelled')
  .onPublish(async message => {
    console.info("START orderCancelled")
    console.info("INPUT data:" + message.json)
    const transactionHash = message.json.transactionHash
    const transaction = await web3.eth.getTransactionReceipt(transactionHash)
    console.info("INFO orderCancelled 1")
    const address = web3.utils.toChecksumAddress(transaction.logs[0].address)
    const maker = web3.utils.toChecksumAddress(
      web3.utils.toHex(transaction.logs[0].data.substring(26, 66))
    )
    const asset = web3.utils.toChecksumAddress(
      web3.utils.toHex(transaction.logs[0].data.substring(90, 130))
    )
    const id = web3.utils
      .hexToNumber(transaction.logs[0].data.substring(130, 194))
      .toString()
    const now = new Date().getTime()
    if (address == bazaaar_v1.options.address ||
        address == bazaaar_v2.options.address ||
        address == bazaaar_v3.options.address
    ){
      console.info("INFO orderCancelled 2")
      const batch = db.batch()
      const deactivateDocOGPPromises = []
      const snapshots = await db
        .collection('order')
        .where('maker', '==', maker)
        .where('asset', '==', asset)
        .where('id', '==', id)
        .where('valid', '==', true)
        .get()
      console.info("INFO orderCancelled 3")
      snapshots.forEach(function(doc) {
        var ref = db.collection('order').doc(doc.id)
        batch.update(ref, {
          result: { status: 'cancelled' },
          valid: false,
          modified: now
        })
        deactivateDocOGPPromises.push(deactivateDocOGP(doc.data()))
      })
      const savePromises = [batch.commit()]
      await Promise.all(savePromises.concat(deactivateDocOGPPromises))
    }
    console.info("END orderCancelled")
  })
*/

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
      if (order.proxy == config.contract[project].bazaaar_v1) {
        try {
          const hash = await bazaaar_v1.methods
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
      } else if (order.proxy == config.contract[project].bazaaar_v2) {
        try {
          const hash = await bazaaar_v2.methods
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
      } else if (order.proxy == config.contract[project].bazaaar_v3) {
        try {
          const hash = await bazaaar_v3.methods
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
    }
  })



exports.api = functions.region('asia-northeast1').https.onRequest(app)

exports.api = functions.region('asia-northeast1').https.onCall(async (params, context) => {
  /*[TODO]
   * db内にアセットのシンボル追加する
   * アセット毎に取得出来るようにする
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





// exports.getOinksByAddress = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
//   res.set('Access-Control-Allow-Origin', '*')
//   res.set('Access-Control-Allow-Methods', 'GET')
//   res.set('Access-Control-Allow-Headers', 'Content-Type, authorization')
//   res.set('Cache-Control', 'public, max-age=300, s-maxage=600')
//   const result = await axios.get('https://api.crypt-oink.io/tokens_of?' + req.query.address)

//   const promises = []
//   for (var i = 0; i < result.data.length; i++) {
//     promises.push(axios.get(config.api.ctn.metadata + result.data[i] + '.json'))
//   }
//   tokens = await Promise.all(promises)
//   console.log(tokens)
//   const data = []
//   for (var i = 0; i < tokens.length; i++) {
//     tokens[i].data.id = result.data[i]
//     data.push(tokens[i].data)
//   }
//   res.json(data)
// })

// exports.getOinkById = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
//   res.set('Access-Control-Allow-Origin', '*')
//   res.set('Access-Control-Allow-Methods', 'GET')
//   res.set('Access-Control-Allow-Headers', 'Content-Type, authorization')
//   res.set('Cache-Control', 'public, max-age=300, s-maxage=600')
//   var result = await axios.get(config.api.ctn.metadata + req.query.id + '.json')
//   res.json(result.data)
// })



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
