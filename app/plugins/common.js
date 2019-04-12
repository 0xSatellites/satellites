const axios = require("axios")
const config = require('../config.json')

const project = process.env.project
const ck = config.contract[project].ck
const ctn = config.contract[project].ctn
const mchh = config.contract[project].mchh
const mche = config.contract[project].mche



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


const getRarity = asset => {
  var rarity
  if(asset.asset == ck){
    rarity = 3
    if(asset.is_fancy) rarity++
    if(asset.is_exclusive) rarity++
  }
  if(asset.asset == ctn){
    rarity = 3
  }
  if(asset.asset == mchh){
    if(asset.metadata.attributes.rarity=='Legendary') rarity =5
    if(asset.metadata.attributes.rarity=='Epic') rarity =4
    if(asset.metadata.attributes.rarity=='Rare') rarity =3
    if(asset.metadata.attributes.rarity=='UnCommon') rarity =2
    if(asset.metadata.attributes.rarity=='Novice') rarity =1
  }
  if(asset.asset == mche){
    if(asset.metadata.attributes.rarity=='Legendary') rarity =5
    if(asset.metadata.attributes.rarity=='Epic') rarity =4
    if(asset.metadata.attributes.rarity=='Rare') rarity =3
    if(asset.metadata.attributes.rarity=='UnCommon') rarity =2
    if(asset.metadata.attributes.rarity=='Common') rarity =1
  }
  return rarity
}

const toAsset = asset => {
  switch(asset) {
  case ck:
  return 'CryptoKitties'
  case ctn:
  return 'Crypt-Oink'
  case mchh:
  case mche:
  return 'MyCryptoHeros'
  }
}

const common = {
  coolDownIndexToSpeed: coolDownIndexToSpeed,
  getRarity: getRarity,
  toAsset: toAsset
}

export default common
