const Web3 = require('web3')
const config = require('../../config.json')
const axios = require("axios")

const web3 = new Web3(config.node.rinkeby.https)

const contract = {
  bazaaar_v1: new web3.eth.Contract(
    config.abi.bazaaar_v1,
    config.contract.rinkeby.bazaaar_v1
  ),
  mche: new web3.eth.Contract(
    config.abi.mchh,
    config.contract.rinkeby.mche
  ),
  mchh: new web3.eth.Contract(
    config.abi.mchh,
    config.contract.rinkeby.mchh
  ),
  ck: new web3.eth.Contract(
    config.abi.ck,
    config.contract.rinkeby.ck
  ),

}

const account = {
  address: null,
  balance: null
}

const activate = async provider => {
  console.log('ethereum-client:activate', provider)
  web3.setProvider(provider)
  const accounts = await web3.eth.getAccounts()
  account.address = accounts[0]
  account.balance = await web3.eth.getBalance(accounts[0])
  setInterval(async () => {
    web3.eth.getAccounts().then(accounts => {
      if (account.address != accounts[0]) {
        location.reload()
      }
    })
  }, 100)
  return account
}

const ownedTokens = async name => {
  console.log('ethereum-client:ownedTokens:' + name)
  const methods = contract[name].methods
  const balance = await methods.balanceOf(account.address).call()
  if (balance == 0) {
    return []
  }
  const promises = []
  for (var i = 0; i < balance; i++) {
    promises.push(methods.tokenOfOwnerByIndex(account.address, i).call())
  }
  const result = await Promise.all(promises)
  return result
}

const ownedTokensCk = async name => {
  console.log('ethereum-client:ownedTokens:' + name)
  const methods = contract[name].methods
  // const balance = await methods.balanceOf(account.address).call()
  // console.log("b" + balance)
  // if (balance == 0) {
  //   return []
  // }
  // const promises = []
  // for (var i = 0; i < balance; i++) {
  //   promises.push(methods.tokensOfOwner(account.address).call())
  //   console.log(promises)
  // }

  //error
  // const result = await axios.get('https://api.cryptokitties.co/kitties?owner_wallet_address=' + account.address)
  // const result = await methods.tokensOfOwner(account.address).call()
  // console.log("tokensOfOwner" + result)
  // const result = await Promise.all(promises)
  // return result
  const result = await axios.get('https://api.cryptokitties.co/kitties?owner_wallet_address=0x686BF528CA3793954547070EbE25649e08197805')
  return result.data.kitties

  // axios.get('https://api.cryptokitties.co/kitties?owner_wallet_address=0x686BF528CA3793954547070EbE25649e08197805')
  // .then(function (response) {
  //   // handle success
  //   console.log(response);
  //   console.log(response.data.kitties)
  //   return response.data.kitties
  // })
  // .catch(function (error) {
  //   // handle error
  //   console.log(error);
  // })
}

const signOrder = async order => {
  console.log('ethereum-client:signOrder:', order)
  const data = web3.utils.soliditySha3(
    order.proxy,
    order.maker,
    order.taker,
    order.creatorRoyaltyRecipient,
    order.asset,
    order.id,
    order.price,
    order.nonce,
    order.salt,
    order.expiration,
    order.creatorRoyaltyRatio,
    order.referralRatio
  )
  const sig = await web3.eth.personal.sign(data, order.maker)
  order.r = sig.substring(0, 66)
  order.s = '0x' + sig.substring(66, 130)
  order.v = '0x' + sig.substring(130, 132)
  return order
}

const client = {
  account: account,
  activate: activate,
  contract: contract,
  ownedTokens: ownedTokens,
  ownedTokensCk:ownedTokensCk,
  signOrder:signOrder,
  utils: web3.utils
}

export default client
