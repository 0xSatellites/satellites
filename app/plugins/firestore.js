import firebase from 'firebase/app'
import 'firebase/firestore'

const config = require('../../functions/config.json')

if (!firebase.apps.length) {
  firebase.initializeApp(config.firebase[process.env.project])
}

const db = firebase.firestore()

const getTwitterDataByUser = async address => {
  const result = []
  const snapshots = await db.collection('user')
    .doc(address).get()
    .then(doc => {
      if (!doc.exists) {
      } else {
        if(doc.data().twitterAccount){
      result.push(doc.data().twitterAccount[0])
        }
      }
    })
  return result
}

const getLatestValidOrders = async limit => {
  const result = []
  const snapshots = await db.collection('order')
    .where('valid', '==', true)
    .orderBy('created', 'desc').limit(limit).get()
  snapshots.forEach(doc => result.push(doc.data()))
  return result
}

const getLowestCostOrderByMakerId = async (maker, id) => {
  var result = {}
  const snapshots = await db.collection('order')
    .where('maker', '==', maker)
    .where('id', '==', id)
    .where('valid', '==', true)
    .orderBy('price_sort').limit(1).get()
  snapshots.forEach(doc => result = doc.data())
  return result
}

const getMarketLength = async (asset, by, order) => {
  const snapshots = await db.collection('order')
    .where('valid', '==', true)
    .get()
  return snapshots.size
}

const getMarket = async (asset, by, order, offset) =>{
  if(asset == 'all'){
    var result = []
    if(offset){
      if(offset > 1){
        var pre = (offset - 1) * 20

        const preSnapshots = await db.collection('order')
          .where('valid', '==', true)
          .orderBy(by, order).limit(pre).get()

        var lastVisible = preSnapshots.docs[preSnapshots.docs.length-1];

        const snapshots = await db.collection('order')
          .where('valid', '==', true)
          .orderBy(by, order).startAfter(lastVisible).limit(20).get()
        snapshots.forEach(doc => result.push(doc.data()))
      }else{
        const snapshots = await db.collection('order')
          .where('valid', '==', true)
          .orderBy(by, order).limit(20).get()
        snapshots.forEach(doc => result.push(doc.data()))
      }
    } else {
      const snapshots = await db.collection('order')
        .where('valid', '==', true)
        .orderBy(by, order).get()
      snapshots.forEach(doc => result.push(doc.data()))
    }
    return result
  }else{
    var result = []
    const snapshots = await db.collection('order')
      .where('asset', '==', config.contract[process.env.project][asset])
      .where('valid', '==', true)
      .orderBy(by, order).get()
    snapshots.forEach(doc => result.push(doc.data()))
    return result
  }
}

const getMarketWithConditions = async (asset, by, order, conditionKeys, conditionValues) =>{
  if(asset == 'all'){
    var result = []
    const snapshots = await db.collection('order')
      .where('valid', '==', true)
      .orderBy(by, order).get()
    snapshots.forEach(doc => result.push(doc.data()))
    return result
  }else{
    var result = []
    const snapshots = await db.collection('order')
      .where('asset', '==', config.contract[process.env.project][asset])
      .where('valid', '==', true)
      .orderBy(by, order).get()
    snapshots.forEach(doc => {
      var data = doc.data()
      for (var j=0; j<conditionKeys.length; j++){
        var check = data.metadata.attributes[conditionKeys[j]]
        if(check=='Legendary') check =5
        else if(check=='Epic') check =4
        else if(check=='Rare') check =3
        else if(check=='Uncommon') check =2
        else if(check=='Novice' || check=='Common') check =1
        if(check==conditionValues[j]){
          result.push(data)
        }
      }
    })
    return result
  }
}

const getOrdersByMaker = async maker => {
  const result = []
  const snapshots = await db.collection('order').where('maker', '==', maker).get()
  snapshots.forEach(doc => result.push(doc.data()))
  return result
}

const getRelatedValidOrders = async (hash, maker, id) => {
  const added = []
  const result = []
  var snapshots = await db.collection('order')
    .where('maker', '==', maker)
    .where('id', '==', id)
    .where('valid', '==', true).get()
  snapshots.forEach(doc => {
    if(doc.id == hash){
      added.push(doc.id)
    }
  })
  snapshots = await db.collection('order')
    .where('valid', '==', true)
    .orderBy('created', 'desc').limit(5).get()
    snapshots.forEach(doc => {
      if(!added.includes(doc.id) && result.length < 4){
        result.push(doc.data())
      }
    })
  return result
}

const getHistoryByAddress = async address => {
  const result = []
  var snapshots
  snapshots = await db.collection('order')
    .where('result.taker', '==', address)
    .where('result.status', '==', 'sold').get()
  snapshots.forEach(doc => result.push(doc.data()))

  snapshots = await db.collection('order')
    .where('maker', '==', address)
    .where('result.status', '==', 'sold').get()

  snapshots.forEach(doc => result.push(doc.data()))
  return result
}

const getValidOrdersByMaker = async maker => {
  const result = []
  const snapshots = await db.collection('order').where('maker', '==', maker).where('valid', '==', true).get()
  snapshots.forEach(doc => result.push(doc.data()))
  return result
}

const getValidOrdersByMakerIdStatus = async (maker, id) => {
  const result = []
  const snapshots = await db.collection('order')
    .where('maker', '==', maker)
    .where('id', '==', id)
    .where('valid', '==', true).get()
  snapshots.forEach(doc => result.push(doc.data()))
  return result
}

const doc = async (collenction, doc) => {
  const snapshot = await db.collection(collenction).doc(doc).get()
  return snapshot.data()
}

const firestore = {
  doc:doc,
  getLatestValidOrders:getLatestValidOrders,
  getLowestCostOrderByMakerId:getLowestCostOrderByMakerId,
  getMarket:getMarket,
  getMarketWithConditions:getMarketWithConditions,
  getMarketLength:getMarketLength,
  getOrdersByMaker:getOrdersByMaker,
  getRelatedValidOrders:getRelatedValidOrders,
  getHistoryByAddress:getHistoryByAddress,
  getValidOrdersByMaker:getValidOrdersByMaker,
  getValidOrdersByMakerIdStatus:getValidOrdersByMakerIdStatus,
  getTwitterDataByUser:getTwitterDataByUser
}

export default firestore
