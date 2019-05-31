import firebase from 'firebase/app'
import 'firebase/functions'

const config = require('../../functions/config.json')

if (!firebase.apps.length) {
  firebase.initializeApp(config.firebase[process.env.project])
}

const app = firebase.app().functions('asia-northeast1');

//for local development
// const app = firebase.app().functions();
// app.useFunctionsEmulator('http://localhost:5001')

const call = async (endpoint, param) => {
  const callable = app.httpsCallable(endpoint);
  console.log("callable",callable)
  const response = await callable(param)
  console.log("res",response)
  return response.data
}

const functions = {
  call:call
}

export default functions
