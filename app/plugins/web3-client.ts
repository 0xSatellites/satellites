const Web3 = require('web3')

export default async function({ store, isServer }, inject) {
  if (isServer) {
    return
  }
  const web3 = (window as any).web3
  const ethereum = (window as any).ethereum

  if (!ethereum && !web3) {
    inject('web3', new Web3('https://rinkeby.infura.io/'))
    return
  }

  if (ethereum) {
    inject('web3', new Web3(ethereum))
    ethereum.enable()
  } else if (web3) {
    inject('web3', new Web3(web3.currentProvider))
  }

  const accounts = await store.$web3.eth.getAccounts()
  store.commit('address', accounts[0].toLowerCase())

  setInterval(async () => {
    const accounts = await store.$web3.eth.getAccounts()
    if (store.state.address !== accounts[0]) {
      store.commit('address', accounts[0].toLowerCase())
    }
  }, 100)
}
