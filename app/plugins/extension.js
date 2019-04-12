const axios = require("axios")
const config = require('../config.json')


const instance = axios.create({
  baseURL: 'https://asia-northeast1-blockbase-bazaaar-sand.cloudfunctions.net/'
})

const getExtensionByWalletAddress = async address => {
    const result = await instance.get('getExtensionByAddress?address=' + address)
    return result.data
}

const getExtensionById = async id => {
    const result = await instance.get('metadata?asset=mche&id=' + id)
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

const getExtensionRarity = extension => {
  var rarity
  if(extension.attributes.rarity=='Legendary') rarity =5
  if(extension.attributes.rarity=='Epic') rarity =4
  if(extension.attributes.rarity=='Rare') rarity =3
  if(extension.attributes.rarity=='UnCommon') rarity =2
  if(extension.attributes.rarity=='Common') rarity =1
  return rarity
}


const extension = {
  coolDownIndexToSpeed:coolDownIndexToSpeed,
  getExtensionByWalletAddress: getExtensionByWalletAddress,
  getExtensionById: getExtensionById,
  getExtensionRarity: getExtensionRarity,
}

export default extension
