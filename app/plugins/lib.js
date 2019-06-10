const axios = require("axios")
const config = require('../../functions/config.json')

const project = process.env.project
const ck = config.contract[project].ck
const ctn = config.contract[project].ctn
const mchh = config.contract[project].mchh
const mche = config.contract[project].mche
const mrm = config.contract[project].mrm

const coolDownIndexToSpeed = index => {
  if (index == 0) return 'Fast'
  else if (index == 1 || index == 2) return 'Swift'
  else if (index == 3 || index == 4) return 'Snappy'
  else if (index == 5 || index == 6) return 'Brisk'
  else if (index == 7 || index == 8) return 'Plodding'
  else if (index == 9 || index == 10) return 'Slow'
  else if (index == 11 || index == 12) return 'Sluggish'
  else if (index == 13) return 'Catatonic'
  else return 'unknown'
}


const getRarity = (asset, type) => {
  var rarity
  if(asset.asset == ck || type == 'ck'){
    rarity = 3
    if(asset.is_fancy) rarity++
    if(asset.is_exclusive) rarity++
  }
  if(asset.asset == ctn || type == 'ctn'){
    rarity = 3
  }
  if(asset.asset == mchh || type == 'mchh'){
    if(asset.metadata){
      if(asset.metadata.attributes.rarity=='Legendary') rarity =5
      if(asset.metadata.attributes.rarity=='Epic') rarity =4
      if(asset.metadata.attributes.rarity=='Rare') rarity =3
      if(asset.metadata.attributes.rarity=='Uncommon') rarity =2
      if(asset.metadata.attributes.rarity=='Novice') rarity =1
    } else {
      if(asset.attributes.rarity=='Legendary') rarity =5
      if(asset.attributes.rarity=='Epic') rarity =4
      if(asset.attributes.rarity=='Rare') rarity =3
      if(asset.attributes.rarity=='Uncommon') rarity =2
      if(asset.attributes.rarity=='Novice') rarity =1
    }
  }
  if(asset.asset == mche || type == 'mche'){
    if(asset.metadata){
      if(asset.metadata.attributes.rarity=='Legendary') rarity =5
      if(asset.metadata.attributes.rarity=='Epic') rarity =4
      if(asset.metadata.attributes.rarity=='Rare') rarity =3
      if(asset.metadata.attributes.rarity=='Uncommon') rarity =2
      if(asset.metadata.attributes.rarity=='Common') rarity =1
    } else {
      if(asset.attributes.rarity=='Legendary') rarity =5
      if(asset.attributes.rarity=='Epic') rarity =4
      if(asset.attributes.rarity=='Rare') rarity =3
      if(asset.attributes.rarity=='Uncommon') rarity =2
      if(asset.attributes.rarity=='Common') rarity =1
    }
  }
  if(asset.asset == mrm || type == 'mrm'){
    rarity = 3
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

const timeConverter = timestamp =>{
  var _d = new Date(timestamp);

  var Y = _d.getFullYear();
  var m = ("0" + (_d.getMonth() + 1)).slice(-2);
  var d = ("0" + _d.getDate()).slice(-2);
  var H = ("0" + _d.getHours()).slice(-2);
  var i = ("0" + _d.getMinutes()).slice(-2);
  var s = ("0" + _d.getSeconds()).slice(-2);

  return `${Y}/${m}/${d} ${H}:${i}:${s}`;
}

const lib = {
  coolDownIndexToSpeed: coolDownIndexToSpeed,
  getRarity: getRarity,
  toAsset: toAsset,
  timeConverter:timeConverter
}

export default lib
