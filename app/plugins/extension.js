const axios = require("axios")
const config = require('../config.json')


const instance = axios.create({
  baseURL: 'https://www.mycryptoheroes.net/'
})

const getOinksByWalletAddress = async address => {
    const result = await instance.get('getOinksByAddress?address=' + address)
    return result.data
}

const getExtensionById = async id => {
const result = await instance.get('metadata/extension/'+ id)
  return result.data
}

const coolDownIndexToSpeed = index => {
  // const entities = await client.contract.ctn.methods
  //          .getEntity(id)
  //          .call()
  // console.log(entities)
  // const Num = await entities.cooldownIndex
  // const number =Number(Num)
  // console.log(Num)
  switch(index) {
    case 0:
    return 'Fast'
    case 1:
    case 2:
    return 'Swift'
    case 3:
    case 4:
    return 'Snappy'
    case 5:
    case 6:
    return 'Brisk'
    case 7:
    case 8:
    return 'Ploddy'
    case 9:
    case 10:
    return 'Slow'
    case 11:
    case 12:
    return 'Sluggish'
    case 13:
    return 'Catatonic'
    default:
    return 'unknown'
  }
}


const getRarity = kitty => {
  var rarity = 3
  if(kitty.is_fancy) rarity++
  if(kitty.is_exclusive) rarity++
  return rarity
}

const extension = {
  coolDownIndexToSpeed:coolDownIndexToSpeed,
  getOinksByWalletAddress: getOinksByWalletAddress,
  getExtensionById: getExtensionById,
  getRarity:getRarity
}

export default extension
