const Web3 = require('web3')
const config = require('../config.json')

var web3

if(process.env.NODE_ENV == 'development') {
  web3 = new Web3(config.node.rinkeby.https)
} else if (process.env.NODE_ENV == 'production') {
  web3 = new Web3(config.node.mainnet.https)
}

var contract

if(process.env.NODE_ENV == 'development') {
  contract = {
    bazaaar_v1: new web3.eth.Contract(
      config.abi.bazaaar_v1,
      config.contract.rinkeby.bazaaar_v1
    ),
    ck: new web3.eth.Contract(
      config.abi.ck,
      config.contract.rinkeby.ck
    ),
  }
} else if (process.env.NODE_ENV == 'production') {
  contract = {
    bazaaar_v1: new web3.eth.Contract(
      config.abi.bazaaar_v1,
      config.contract.mainnet.bazaaar_v1
    ),
    mche: new web3.eth.Contract(
      config.abi.mchh,
      config.contract.mainnet.mche
    ),
    mchh: new web3.eth.Contract(
      config.abi.mchh,
      config.contract.mainnet.mchh
    ),
    ck: new web3.eth.Contract(
      config.abi.ck,
      config.contract.mainnet.ck
    ),
  }
}

const account = {
  address: null,
  balance: null
}

const activate = async provider => {
  web3.setProvider(provider)
  const accounts = await web3.eth.getAccounts()
  account.address = accounts[0]
  account.balance = await web3.eth.getBalance(accounts[0])
  setInterval(async () => {
    web3.eth.getAccounts().then(accounts => {
      if (account.address != accounts[0]) {
        account.address = accounts[0]
        location.reload()
      }
    })
  }, 100)
  return account
}

const ownedTokens = async name => {
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

const signOrder = async order => {
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
  signOrder:signOrder,
  utils: web3.utils
}

export default client
