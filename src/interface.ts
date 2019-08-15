import { SignedOrder } from '0x.js'

export interface SatellitesContractAddresses {
  distributer: string
  passer: string
}

export interface RefinedOrders {
  [address: string]: {
    [tokenId: string]: SignedOrder
  }
}
