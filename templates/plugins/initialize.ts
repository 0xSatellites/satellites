import Satellites from '../../src'
//  import Satellites from 'satellites.js'
import { config } from './config'
const Web3 = require('web3')

export default async function({ store, isServer }, inject) {
  if (isServer) {
    return
  }

  inject('config', config)

  const web3 = (window as any).web3
  const ethereum = (window as any).ethereum

  if (!ethereum && !web3) {
    inject('web3', new Web3(store.$config.infura))
    const satellites = new Satellites(store.$config.networkId, store.$web3.currentProvider, store.$config.relayer)
    inject('satellites', satellites)
    return
  }

  if (ethereum) {
    inject('web3', new Web3(ethereum))
    ethereum.enable().then(function(accounts) {
      if (accounts.length > 0) {
        store.commit('address', accounts[0].toLowerCase())
      }
    })
  } else if (web3) {
    inject('web3', new Web3(web3.currentProvider))
  }

  const satellites = new Satellites(store.$config.networkId, store.$web3.currentProvider, store.$config.relayer)
  inject('satellites', satellites)

  const accounts = await store.$web3.eth.getAccounts()
  if (accounts.length > 0) {
    store.commit('address', accounts[0].toLowerCase())
    setInterval(async () => {
      const accounts = await store.$web3.eth.getAccounts()
      const address = accounts[0].toLowerCase()
      if (store.state.address !== address) {
        location.reload()
      }
    }, 100)
  }
}
