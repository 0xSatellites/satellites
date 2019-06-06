const axios = require("axios")
const config = require('../../functions/config.json')

const kittyInstance = axios.create({
  baseURL: 'https://public.api.cryptokitties.co/v1/',
  headers: {'x-api-token': config.token.kitty}
})

const oinkInstance = axios.create({
  baseURL: 'https://api.crypt-oink.io/',
})

const twitterInstance = axios.create({
  baseURL: "https://api.twitter.com/1.1/users/",
})

console.log(twitterInstance)

const getKittiesByWalletAddress = async address => {
  const result = await kittyInstance.get('kitties?owner_wallet_address='+ address +'&limit=100')
  return result.data.kitties
}

const getOinkIdsByWalletAddress = async address => {
  const result = await oinkInstance.get('tokens_of?' + address)
  return result.data
}

const getTwitterDataByTwitterId = async twitterId => {
  const result = await twitterInstance.get('show.json?user_id	=' + twitterId)
  return result.data
}

const api = {
  getKittiesByWalletAddress: getKittiesByWalletAddress,
  getOinkIdsByWalletAddress: getOinkIdsByWalletAddress,
  getTwitterDataByTwitterId: getTwitterDataByTwitterId
}

export default api
