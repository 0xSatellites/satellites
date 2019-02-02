import firebase from 'firebase/app'
import 'firebase/functions'

const config = require('../../config.json')

if (!firebase.apps.length) {
  firebase.initializeApp(config.firebase)
}
var functions = firebase.app().functions(/*'asia-northeast1'*/);
functions.useFunctionsEmulator('http://localhost:5000')

const call = async (endpoint, param) => {
  const callable = functions.httpsCallable(endpoint);
  const response = await callable(param)
  return response.data
}

const result = {
  call:call
}

export default result
