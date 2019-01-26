const Web3 = require('web3')
const config = require('../../config.json')

const web3 = new Web3(config.node.https)
/*
const hero = new web3.eth.Contract(config.abi.mch.hero, config.contract.mch.hero)
const extension = new web3.eth.Contract(config.abi.mch.extension, config.contract.mch.extension)
const bazaaar = new web3.eth.Contract(config.abi.bazaaar.proxy_v1, config.contract.bazaaar.proxy_v1)
*/
const activate = async (provider) => {
  web3.setProvider(provider)
  const accounts = await web3.eth.getAccounts()
  const address = accounts[0]
  const balance = await web3.eth.getBalance(address)
  contract.selectedAddress = address
  contract.balance = balance
  const account = {
    address:address,
    balance:balance
  }
  setInterval(async () => {
    const accounts = await web3.eth.getAccounts()
    const address = accounts[0]
    if(contract.selectedAddress != address){
      location.reload();
    }
  }, 100)
  return account
}

const account = {
  activate:activate,
  selectedAddress:null,
  balance:null
}

export default account;
