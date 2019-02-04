import firebase from 'firebase/app'
import 'firebase/firestore'

const config = require('../config.json')

if (!firebase.apps.length) {
  firebase.initializeApp(config.firebase)
}

const db = firebase.firestore()

const doc = async (collenction, doc) => {
  console.log('db:get', collenction, doc)
  const snapshot = await db.collection(collenction).doc(doc).get()
  return snapshot.data()
}

const docs = async (collenction, a, cond, b)  => {
  console.log('db:gets', collenction, a, cond, b)
  const result = []
  const snapshots = await db.collection(collenction).where(a, cond, b).get()
  snapshots.forEach(doc => result.push(doc.data()));
  return result
}

const firestore = {
  doc:doc,
  docs: docs,
}

export default firestore
