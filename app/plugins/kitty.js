const axios = require("axios")

const config = require('../config.json')

const instance = axios.create({
    baseURL: 'https://public.api.cryptokitties.co/v1/',
    headers: {'x-api-token': config.token.kitty}
  })

const getKittiesByWalletAddress = async address => {
    const result = await instance.get('kitties?owner_wallet_address='+ address +'&limit=100')
    return result.data.kitties
  }

const getKittyById = async id => {
  const result = await instance.get('kitties/'+ id)
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

const kitty = {
  coolDownIndexToSpeed:coolDownIndexToSpeed,
  getKittiesByWalletAddress: getKittiesByWalletAddress,
  getKittyById: getKittyById,
  getRarity:getRarity,
  timeConverter: timeConverter
}

export default kitty
