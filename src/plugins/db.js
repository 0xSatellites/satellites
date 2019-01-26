const firebase = require('firebase');
const config = require('../config.json')

if (!firebase.apps.length) {
  firebase.initializeApp(config.firebase);
}

const db = firebase.firestore();

const getDocByKey = async (key) => {
  const doc = await db.collection('order').doc(key).get();
  return doc.data();
}

const client = {
    getDocByKey:getDocByKey
}

export default client