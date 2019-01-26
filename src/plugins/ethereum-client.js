const Web3 = require('web3')
const config = require('../../config.json')

const web3 = new Web3(config.node.https)

const bazaaar = {
  v1:new web3.eth.Contract(config.abi.bazaaar.proxy_v1, config.contract.bazaaar.proxy_v1)
}

const mch = {
  hero:new web3.eth.Contract(config.abi.mch.hero, config.contract.mch.hero),
  extension:new web3.eth.Contract(config.abi.mch.extension, config.contract.mch.extension),
}

const contract = {
  bazaaar:bazaaar,
  mch:mch
}

const account = {
  address:null,
  balance:null
}

const activate = async (provider) => {
  web3.setProvider(provider)
  const accounts = await web3.eth.getAccounts()
  const address = accounts[0]
  const balance = await web3.eth.getBalance(address)
  account.address = address
  account.balance = balance
  setInterval(async () => {
    const accounts = await web3.eth.getAccounts()
    const address = accounts[0]
    if(account.address != address){
      location.reload();
    }
  }, 100)
  return account
}

const client = {
  contract:contract,
  account:account,
  activate:activate
}

export default client
