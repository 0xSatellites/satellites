const config = require('../../config.json')

const axios= require('axios');
const admin = require('firebase-admin');
const serviceAccount = require('../../.serviceAccountKey.json');

const Web3 = require('web3');
const web3 = new Web3(config.node.mainnet.https)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

var db = admin.firestore()

const mchh_meta = config.api.mch.metadata + "hero/"
const mchh_type_meta = config.api.mch.metadata + "heroType/"
const mche_meta = config.api.mch.metadata + "extension/"
const mche_type_meta = config.api.mch.metadata + "extensionType/"
const mch_skill = config.api.mch.metadata + "skill/"

//mchh()
//mche()
custom()

async function mchh(){
  const contract = new web3.eth.Contract(
    config.abi.mchh,
    config.contract.mainnet.mchh
  )

  const limit = await contract.methods.totalSupply().call();

  for (var i=0; i<limit; i++){
    const result = await contract.methods.tokenByIndex(i).call()
    try {
      const general = await axios({
        method:'get',
        url:mchh_meta + result,
        responseType:'json'
      })

      const hero_type_id = general.data.extra_data.hero_type
      const active_skill_id = general.data.extra_data.active_skill_id
      const passive_skill_id = general.data.extra_data.passive_skill_id

      const hero_type = await axios({
        method:'get',
        url:mchh_type_meta + hero_type_id,
        responseType:'json'
      })

      const active_skill = await axios({
        method:'get',
        url:mch_skill + active_skill_id,
        responseType:'json'
      })

      const passive_skill = await axios({
        method:'get',
        url:mch_skill + passive_skill_id,
        responseType:'json'
      })

      general.data.hero_type = hero_type.data
      general.data.active_skill = active_skill.data
      general.data.passive_skill = passive_skill.data

      const doc = await db.collection(config.constant.image).doc('mchh' + '_' + result.toString().substring(0,4)).get();
      const image = doc.data();
      general.data.cache_image = image.url
      console.log("done:" + result)
      await db.collection(config.constant.metadata).doc('mchh' + '_' + result.toString()).set(general.data)
  } catch (err){
      console.log("error:" + result)
  }
  }
}

async function mche(){
  const contract = new web3.eth.Contract(
    config.abi.mche,
    config.contract.mainnet.mche
  )

  const limit = await contract.methods.totalSupply().call();

  for (var i=0; i<limit; i++){
    const result = await contract.methods.tokenByIndex(i).call()
    try {
      const general = await axios({
        method:'get',
        url:mche_meta + result,
        responseType:'json'
      })
      const extension_type_id = general.data.extra_data.extension_type
      const skill_id = general.data.extra_data.skill_id

      const extension_type = await axios({
        method:'get',
        url:mche_type_meta + extension_type_id,
        responseType:'json'
      })

      const skill = await axios({
        method:'get',
        url:mch_skill + skill_id,
        responseType:'json'
      })

      general.data.extension_type = extension_type.data
      general.data.skill = skill.data

      const doc = await db.collection(config.constant.image).doc('mche' + '_' + result.toString().substring(0,4)).get();
      const image = doc.data();
      general.data.cache_image = image.url
      console.log("done:" + result)
      await db.collection(config.constant.metadata).doc('mche' + '_' + result.toString()).set(general.data)
    } catch (err){
        console.log("error:" + result)
    }
  }
}


async function mche(){
  const contract = new web3.eth.Contract(
    config.abi.mche,
    config.contract.mainnet.mche
  )
  
  const data = ["mche_10012160", "mche_10012161", "mche_10012162", "mche_10012163", "mche_10012164", "mche_10012165", "10012166", "10012167", "10012168"]

  for (var i=0; i<limit; i++){
    try {
      const general = await axios({
        method:'get',
        url:mche_meta + result,
        responseType:'json'
      })
      const extension_type_id = general.data.extra_data.extension_type
      const skill_id = general.data.extra_data.skill_id

      const extension_type = await axios({
        method:'get',
        url:mche_type_meta + extension_type_id,
        responseType:'json'
      })

      const skill = await axios({
        method:'get',
        url:mch_skill + skill_id,
        responseType:'json'
      })

      general.data.extension_type = extension_type.data
      general.data.skill = skill.data

      const doc = await db.collection(config.constant.image).doc('mche' + '_' + result.toString().substring(0,4)).get();
      const image = doc.data();
      general.data.cache_image = image.url
      console.log("done:" + result)
      await db.collection(config.constant.metadata).doc('mche' + '_' + result.toString()).set(general.data)
    } catch (err){
        console.log("error:" + result)
    }
  }
}