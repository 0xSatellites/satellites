import firebase from 'firebase/app'
import 'firebase/firestore'

const config = require('../config.json')

if (!firebase.apps.length) {
  firebase.initializeApp(config.firebase)
}

const db = firebase.firestore()

const getOrderByKey = async key => {
  console.log('db:getOrderByKey')
  const doc = await db
    .collection('order')
    .doc(key)
    .get()
  return doc.data()
}

const getOrderHistoryByAccount = async key => {
  console.log('db:getOrderHistoryByAccount')
  const result = []
  const snapshots = await db.collection("order")
  .where("maker", "==", key.address)
  // .where("status", "==", "selling")
  .get()
  snapshots.forEach((doc) => {
    const data = doc.data()
    result.push(data)
  });
  return result
}


const getAssetByKey = async key => {
  console.log('db:getAssetByKey')
  const doc = await db
    .collection('metadata')
    .doc(key)
    .get()
  return doc.data()
}

const getAssetListByKey = async key => {
  console.log('db:getAssetListByKey')
  const promises = []
  for (var i = 0; i < key.length; i++) {
    promises.push(
      db
        .collection('metadata')
        .doc(key[i])
        .get()
    )
  }
  const snapshots = await Promise.all(promises)
  const result = []
  for (var i = 0; i < snapshots.length; i++) {
    result.push(snapshots[i].data())
  }
  return result
}

const getOrderHistoryByType = async type => {
  console.log('db:getOrderHistoryByType')
  const result = {
    labels:[],
    total_prices:[]
  }
  const snapshots = await db.collection("order_opensea").where("type", "==", type).get()
  snapshots.forEach((doc) => {
    const data = doc.data()
    result.labels.push("")
    result.total_prices.push(data.total_price / 1000000000000000000)
  });
  return result
}

const set = async (collection, hash, order) => {
  await db.collection(collection).doc(hash).set(order)
}

const client = {
  getAssetListByKey: getAssetListByKey,
  getOrderByKey: getOrderByKey,
  getOrderHistoryByAccount: getOrderHistoryByAccount,
  getAssetByKey: getAssetByKey,
  getOrderHistoryByType:getOrderHistoryByType,
  set:set
}

export default client
