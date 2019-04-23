const Web3 = require('web3')
const config = require('../config.json')

const  web3 = new Web3(config.node[process.env.project].https)
const contract = {
  bazaaar_v1: new web3.eth.Contract(
    config.abi.bazaaar_v1,
    config.contract[process.env.project].bazaaar_v1
  ),
  bazaaar_v2: new web3.eth.Contract(
    config.abi.bazaaar_v2,
    config.contract[process.env.project].bazaaar_v2
  ),
  bazaaar_v3: new web3.eth.Contract(
    config.abi.bazaaar_v3,
    config.contract[process.env.project].bazaaar_v3
  ),
  ck: new web3.eth.Contract(
    config.abi.ck,
    config.contract[process.env.project].ck
  ),
  ctn: new web3.eth.Contract(
    config.abi.ctn,
    config.contract[process.env.project].ctn
  ),
  ctn_distributer: config.contract[process.env.project].ctn_distributer,
  mchh: new web3.eth.Contract(
    config.abi.mchh,
    config.contract[process.env.project].mchh
  ),
  mche: new web3.eth.Contract(
    config.abi.mche,
    config.contract[process.env.project].mche
  )
}

const project = process.env.project
const ck = config.contract[project].ck
const ctn = config.contract[project].ctn
const mchh = config.contract[project].mchh
const mche = config.contract[project].mche

const account = {
  address: null,
  balance: null
}

const activate = async provider => {
  try{
    web3.setProvider(provider)
    if(window.ethereum){
      await ethereum.enable()
    }
    const accounts = await web3.eth.getAccounts()
    if(accounts.length > 0) {
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
    }
    return account
  } catch (err) {
    alert(err)
  }
}

const ownedTokens = async name => {
  const balance = await contract[name].methods.balanceOf(account.address).call()
  if (balance == 0) {
    return []
  }
  const promises = []
  for (var i = 0; i < balance; i++) {
    promises.push(contract[name].methods.tokenOfOwnerByIndex(account.address, i).call())
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

const signUser = async() =>{
  const data = "hello world"
  const signedUser = await web3.eth.personal.sign(data, account.address)
  return signedUser
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

const client = {
  account: account,
  activate: activate,
  contract: contract,
  ownedTokens: ownedTokens,
  signOrder:signOrder,
  utils: web3.utils,
  web3: web3,
  toAsset: toAsset,
  signUser: signUser
}

export default client
