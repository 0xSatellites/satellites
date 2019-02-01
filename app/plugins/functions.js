import firebase from 'firebase/app'
import 'firebase/functions'

const config = require('../../config.json')

if (!firebase.apps.length) {
  firebase.initializeApp(config.firebase)
}


const call = async key => {
    const order = firebase.app().functions('asia-northeast1').httpsCallable('order');
    return await order()
  }

const functions = {
    call:call
}

export default functions
