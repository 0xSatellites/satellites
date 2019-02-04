import firebase from 'firebase/app'
import 'firebase/functions'

const config = require('../config.json')

if (!firebase.apps.length) {
  firebase.initializeApp(config.firebase)
}

const app = firebase.app().functions('asia-northeast1');

//const app = firebase.app().functions();
//app.useFunctionsEmulator('http://localhost:5000')

const call = async (endpoint, param) => {
  console.log('functions:call', endpoint, param)
  const callable = app.httpsCallable(endpoint);
  const response = await callable(param)
  return response.data
}

const functions = {
  call:call
}

export default functions
