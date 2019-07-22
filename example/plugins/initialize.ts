const Web3 = require('web3')
const config = require('./config.json')
import Satellites from '../../src/index'

export default async function({ store, isServer }, inject) {
  if (isServer) {
    return
  }

  inject('config', config)

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

  const tokens = [
    '0xc106d47fb4bf5f9ebaf46e3219ef3fabcbd26606',
    '0x5220debd5a575d1bf85b5531c9e0f6ced243975c',
    '0x16baf0de678e52367adc69fd067e5edd1d33e3bf',
    '0x587ae915d4ccaa5c2220c638069f2605e1f7404c'
  ]

  const satellites = new Satellites(4, store.$web3.currentProvider, 'http://35.200.51.207:3000/v2/', tokens)
  inject('satellites', satellites)

  setInterval(async () => {
    const accounts = await store.$web3.eth.getAccounts()
    const address = accounts[0].toLowerCase()
    if (store.state.address !== address) {
      location.reload()
    }
  }, 100)
}
