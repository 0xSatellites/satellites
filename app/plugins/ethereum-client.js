const Web3 = require('web3')
const config = require('../../config.json')

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
    config.contract.rinkeby.mchh)
}

const account = {
  address: null,
  balance: null
}

const activate = async provider => {
  console.log('ethereum-client:activate')
  web3.setProvider(provider)
  const accounts = await web3.eth.getAccounts()
  const address = accounts[0]
  const balance = await web3.eth.getBalance(address)
  account.address = address
  account.balance = balance
  setInterval(async () => {
    const accounts = await web3.eth.getAccounts()
    const address = accounts[0]
    if (account.address != address) {
      location.reload()
    }
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
  for (var i = 0; i < result.length; i++) {
    result[i] = name + '_' + result[i]
  }
  return result
}

const finalizeOrder = async order => {
  const data = client.utils.soliditySha3(
    order.proxy,
    order.maker,
    order.taker,
    order.artEditRoyaltyRecipient,
    order.id,
    order.price,
    order.artEditRoyaltyRatio,
    order.salt
  )
  const sig = await client.eth.personal.sign(data, order.maker, '')

  order.r = sig.substring(0, 66)
  order.s = '0x' + sig.substring(66, 130)
  order.v = '0x' + sig.substring(130, 132)

  const hash = await client.contract.bazaaar_v1.methods
    .requireValidOrder_(
      [order.proxy, order.maker, order.taker, order.artEditRoyaltyRecipient],
      [order.id, order.price, order.artEditRoyaltyRatio, order.salt],
      order.v,
      order.r,
      order.s
    )
    .call()
  return hash
}
const client = {
  account: account,
  activate: activate,
  contract: contract,
  ownedTokens: ownedTokens,
  finalizeOrder:finalizeOrder,
  utils: web3.utils,
  eth: web3.eth
}

export default client
