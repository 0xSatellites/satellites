import firebase from 'firebase/app';
import 'firebase/storage';

const config = require('../config.json')

if (!firebase.apps.length) {
  firebase.initializeApp(config.firebase);
}

const storageRef = firebase.storage().ref();

const ogp = async (key, base64) => {
    const ref = storageRef.child('ogp/' + key + '.png');
    ref.putString(base64, 'base64', {contentType:'image/png'}).then(function(snapshot) {
        console.log('Uploaded a blob or file!');
    });
}

const storage = {
    ogp:ogp,
}

export default storage