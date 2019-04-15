import firebase from 'firebase/app'
import 'firebase/firestore'

const config = require('../config.json')

if (!firebase.apps.length) {
  firebase.initializeApp(config.firebase[process.env.project])
}

const db = firebase.firestore()

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

const getMarket = async (asset, by, order) =>{
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
    snapshots.forEach(doc => result.push(doc.data()))
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
  getOrdersByMaker:getOrdersByMaker,
  getRelatedValidOrders:getRelatedValidOrders,
  getHistoryByAddress:getHistoryByAddress,
  getValidOrdersByMaker:getValidOrdersByMaker,
  getValidOrdersByMakerIdStatus:getValidOrdersByMakerIdStatus
}

export default firestore
