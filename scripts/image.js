const config = require('../config.json')
const admin = require('firebase-admin')
const serviceAccount = require('../.serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const bucket = admin.storage().bucket('blockbase-bazaaar-sand.appspot.com');
const db = admin.firestore()

const UUID = require("uuid-v4");

const mchh_path = "https://www.origin.sand.mch.djty.co/images/heroes/2000/"
const mche_path = "https://www.origin.sand.mch.djty.co/images/extensions/2000/"
const mchh_range_2 = [2001, 2009]
const mchh_range_3 = [3001, 3018]
const mchh_range_4 = [4001, 4020]
const mchh_range_5 = [5001, 5013]

const mche_range_1 = [1001, 1014]
const mche_range_2 = [2001, 2014]
const mche_range_3 = [3001, 3014]
const mche_range_4 = [4001, 4014]
const mche_range_5 = [5001, 5014]

//mchh()
//mche()

async function mchh(){
  var list = []
  for(var i=mchh_range_5[0]; i<=mchh_range_5[1]; i++){
    list.push(i)
  }
  for(var i=mchh_range_4[0]; i<=mchh_range_4[1]; i++){
    list.push(i)
  }
  for(var i=mchh_range_3[0]; i<=mchh_range_3[1]; i++){
    list.push(i)
  }
  for(var i=mchh_range_2[0]; i<=mchh_range_2[1]; i++){
    list.push(i)
  }
  bulk(mchh_path, list, "png", "mchh")
}

async function mche(){
  var list = []
  for(var i=mche_range_5[0]; i<=mche_range_5[1]; i++){
    list.push(i)
  }
  for(var i=mche_range_4[0]; i<=mche_range_4[1]; i++){
    list.push(i)
  }
  for(var i=mche_range_3[0]; i<=mche_range_3[1]; i++){
    list.push(i)
  }
  for(var i=mche_range_2[0]; i<=mche_range_2[1]; i++){
    list.push(i)
  }
  for(var i=mche_range_1[0]; i<=mche_range_1[1]; i++){
    list.push(i)
  }
  bulk(mche_path, list, "png", "mche")
}

async function bulk(path, list, format, category){
  console.log("start bulk: " + list)
  for(var i=0; i<list.length; i++){
    await single(path, list[i], format, category)
  }
}

async function single(path, i, format, category){
  console.log("start single: " + path, i, format, category)
  var uuid = UUID();
  var data = await bucket.upload(path + i + "." + format,{
    destination: "/" + category + "/" + i + ".png",
    uploadType: "media",
    metadata: {
      contentType: 'image/' + format,
      metadata: {
        firebaseStorageDownloadTokens: uuid
      }
    }
  })
  var file = data[0];
  var record = {
    url:"https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + uuid,
  }
  db.collection('image').doc(category + '_' + i.toString()).set(record)

}
