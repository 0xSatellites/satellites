const axios = require("axios")

const config = require('../config.json')

const instance = axios.create({
    baseURL: 'https://api.crypt-oink.io/',
    headers: {'x-api-token': config.token.oink}
  })

const instance2 = axios.create({
    baseURL: 'https://api.opensea.io/api/v1/',
    headers: {'x-api-token': config.token.oink}
  })

  const getOinksByWalletAddress = async address => {
    const result = await instance2.get('assets/?owner='+ address +"&asset_contract_address=" + config.token.oink)
    return result.data.kitties
  }

const getOinkById = async id => {
  const result = await instance.get('metadata?'+ id)
  return result.data
}

const coolDownIndexToSpeed = index => {
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
    return 'Plodding'
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

const oink = {
  coolDownIndexToSpeed:coolDownIndexToSpeed,
  getOinksByWalletAddress: getOinksByWalletAddress,
  getOinkById: getOinkById,
  getRarity:getRarity
}

export default oink
