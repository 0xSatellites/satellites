import  firebase from 'firebase/app';
import 'firebase/firestore';

const config = require('../config.json')

if (!firebase.apps.length) {
  firebase.initializeApp(config.firebase);
}

const db = firebase.firestore();

const getOrderByKey = async (key) => {
  console.log("db:getOrderByKey")
  const doc = await db.collection('order').doc(key).get();
  return doc.data();
}

const getAssetByKey = async (key) => {
  console.log("db:getAssetByKey")
  const doc = await db.collection('metadata').doc(key).get();
  return doc.data();
}

const getAssetListByKey = async (key) => {
  console.log("db:getAssetListByKey")
  const promises = []
  for(var i=0; i<key.length; i++){
    promises.push(db.collection('metadata').doc(key[i]).get())
  }
  const snapshots = await Promise.all(promises)
  const result = []
  for(var i=0; i<snapshots.length; i++){
    result.push(snapshots[i].data())
  }
  return result
}

const client = {
  getAssetListByKey:getAssetListByKey,
  getOrderByKey:getOrderByKey,
  getAssetByKey:getAssetByKey
}

export default client