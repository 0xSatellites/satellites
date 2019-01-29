import firebase from 'firebase/app'
import 'firebase/storage'

const config = require('../config.json')

if (!firebase.apps.length) {
  firebase.initializeApp(config.firebase)
}

const storageRef = firebase.storage().ref()

const ogp = async (key, base64) => {
  console.log('storage:ogp')
  const ref = storageRef.child('ogp/' + key + '.png')
  await ref.putString(base64, 'base64', { contentType: 'image/png' })
  return await ref.getDownloadURL()
}

const storage = {
  ogp: ogp
}

export default storage
