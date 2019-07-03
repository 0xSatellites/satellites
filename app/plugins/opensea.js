import * as Web3 from 'web3'
import { OpenSeaPort, Network } from 'opensea-js'

// This example provider won't let you make transactions, only read-only calls:
const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io')

const seaport = new OpenSeaPort(provider, {
  networkName: Network.Rinkeby
})

export default seaport