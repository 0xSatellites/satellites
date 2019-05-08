const axios = require("axios")
const config = require('../config.json')

const instance = axios.create({
    baseURL: 'https://public.api.cryptokitties.co/v1/',
    headers: {'x-api-token': config.token.kitty}
  })

const instance2 = axios.create({
  baseURL: 'https://asia-northeast1-blockbase-bazaaar-sand.cloudfunctions.net/',
})

const getKittiesByWalletAddress = async address => {
  const result = await instance.get('kitties?owner_wallet_address='+ address +'&limit=100')
  return result.data.kitties
}

const getOinksByWalletAddress = async address => {
    const result = await instance2.get('getOinksByAddress?address=' + address)
    return result.data
}




const api = {
  getKittiesByWalletAddress: getKittiesByWalletAddress,
  getOinksByWalletAddress: getOinksByWalletAddress,

}

export default api