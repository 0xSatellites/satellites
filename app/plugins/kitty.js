const axios = require("axios")

const config = require('../config.json')

const instance = axios.create({
    baseURL: 'https://public.api.cryptokitties.co/v1/',
    headers: {'x-api-token': config.token.kitty}
  })

const getKittiesByWalletAddress = async address => {
    const result = await instance.get('kitties?owner_wallet_address='+ address)
    return result.data.kitties
  }

const getKittyById = async id => {
  const result = await instance.get('kitties/'+ id)
  return result.data
}
const kitty = {
  getKittiesByWalletAddress: getKittiesByWalletAddress,
  getKittyById: getKittyById
}

export default kitty
