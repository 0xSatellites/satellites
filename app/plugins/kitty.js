const axios = require("axios")

const instance = axios.create({
    baseURL: 'https://api.cryptokitties.co/',
    headers: {'x-api-token': 'NjRDB41VxE4elimp3ggfuOy_qUbWbOL5mmYvjG8aH-c'}
  })

const getKittiesByWalletAddress = async address => {
    console.log('kitty:getKittiesByWalletAddress:' + address)
    const result = await instance.get('kitties?owner_wallet_address='+ address)
    return result.data.kitties
  }

const getKittyById = async id => {
  console.log('kitty:getKittyById:' + id)
  const result = await instance.get('kitties/'+ id)
  return result.data
}
const kitty = {
  getKittiesByWalletAddress: getKittiesByWalletAddress,
  getKittyById: getKittyById
}

export default kitty
