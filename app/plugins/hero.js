const axios = require("axios")
const config = require('../config.json')


const instance = axios.create({
  baseURL: 'https://asia-northeast1-blockbase-bazaaar-sand.cloudfunctions.net/'
})

const getHeroByWalletAddress = async address => {
    const result = await instance.get('getHeroByAddress?address=' + address)
    return result.data
}

const getHeroById = async id => {
  const result = await instance.get('getHeroById?id='+ id)
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


const getHeroRarity = hero => {
  var rarity
  if(hero.attributes.rarity=='Legendary') rarity =5
  if(hero.attributes.rarity=='Epic') rarity =4
  if(hero.attributes.rarity=='Rare') rarity =3
  if(hero.attributes.rarity=='UnCommon') rarity =2
  if(hero.attributes.rarity=='Novice') rarity =1
  return rarity
}

const hero = {
  coolDownIndexToSpeed:coolDownIndexToSpeed,
  getHeroByWalletAddress: getHeroByWalletAddress,
  getHeroById: getHeroById,
  getHeroRarity:getHeroRarity
}

export default hero
