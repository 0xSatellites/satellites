const Web3 = require('web3')
import Satellites from '../../src/index'

export default async function({ store, isServer }, inject) {
  if (isServer) {
    return
  }

  const tokens: { [networkId: number]: string[] } = {
    1: [
      '0x06012c8cf97bead5deae237070f9587f8e7a266d',
      '0x1a94fce7ef36bc90959e206ba569a12afbc91ca1',
      '0x273f7f8e6489682df756151f5525576e322d51a3',
      '0xdceaf1652a131f32a821468dc03a92df0edd86ea'
    ],
    4: [
      '0xc106d47fb4bf5f9ebaf46e3219ef3fabcbd26606',
      '0x5220debd5a575d1bf85b5531c9e0f6ced243975c',
      '0x16baf0de678e52367adc69fd067e5edd1d33e3bf',
      '0x587ae915d4ccaa5c2220c638069f2605e1f7404c'
    ]
  }

  const infura: { [networkId: number]: string } = {
    1: 'https://mainnet.rinkeby.infura.io/',
    4: 'https://rinkeby.infura.io/'
  }

  const NETWORK_ID = Number(process.env.NETWORK_ID) || 1
  const RELAYER = process.env.RELAYER || 'https://mainnet.ookimaki.com/v2/'

  const web3 = (window as any).web3
  const ethereum = (window as any).ethereum

  if (!ethereum && !web3) {
    inject('web3', new Web3(infura[NETWORK_ID]))
    return
  }

  if (ethereum) {
    inject('web3', new Web3(ethereum))
    ethereum.enable()
  } else if (web3) {
    inject('web3', new Web3(web3.currentProvider))
  }

  const satellites = new Satellites(NETWORK_ID, store.$web3.currentProvider, RELAYER, tokens[NETWORK_ID])
  inject('satellites', satellites)

  const accounts = await store.$web3.eth.getAccounts()
  store.commit('address', accounts[0].toLowerCase())

  setInterval(async () => {
    const accounts = await store.$web3.eth.getAccounts()
    const address = accounts[0].toLowerCase()
    if (store.state.address !== address) {
      location.reload()
    }
  }, 100)
}
