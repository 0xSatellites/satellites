const axios = require("axios")

const instance = axios.create({
    baseURL: 'https://api.cryptokitties.co/',
    headers: {'x-api-token': 'NjRDB41VxE4elimp3ggfuOy_qUbWbOL5mmYvjG8aH-c'}
  });

const ownedTokens = async address => {
    console.log('kitty:ownedTokens:' + address)
    const result = await instance.get('kitties?owner_wallet_address='+ address)
    return result.data.kitties
  }

const kitty = {
    ownedTokens: ownedTokens
}

export default kitty
