import firebase from 'firebase/app'
import 'firebase/firestore'

const config = require('../../config.json')

if (!firebase.apps.length) {
  firebase.initializeApp(config.firebase)
}

const db = firebase.firestore()

const getLatestOrders = async limit => {
  const result = []
  const snapshots = await db.collection('order')
    .orderBy('created', 'desc').limit(limit).get()
  snapshots.forEach(doc => result.push(doc.data()))
  return result
}

const getOrdersByMaker = async maker => {
  const result = []
  const snapshots = await db.collection('order').where('maker', '==', maker).get()
  snapshots.forEach(doc => result.push(doc.data()))
  return result
}

const getOrdersByMakerIdStatus = async (maker, id, status) => {
  const result = []
  const snapshots = await db.collection('order')
    .where('maker', '==', maker)
    .where('id', '==', id)
    .where('status', '==', status).get()
  snapshots.forEach(doc => result.push(doc.data()))
  return result
}

const doc = async (collenction, doc) => {
  const snapshot = await db.collection(collenction).doc(doc).get()
  return snapshot.data()
}

const firestore = {
  doc:doc,
  getLatestOrders:getLatestOrders,
  getOrdersByMaker:getOrdersByMaker,
  getOrdersByMakerIdStatus:getOrdersByMakerIdStatus
}

export default firestore
