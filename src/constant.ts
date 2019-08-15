import { SatellitesContractAddresses } from './interface'

export const DECIMALS = 18
export const GAS_LIMIT = 450000
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'

export const networkToSatellitesContractAddresses: { [networkId: number]: SatellitesContractAddresses } = {
  1: {
    distributer: '0x38c751500bfbf3f525b37a393a2f0c1bf5e8386a',
    passer: '0x1416e2cfd202916037f7862c66f8f57ebe792dfd'
  },
  4: {
    distributer: '0x4618b3d9091387f6ebe2ab241dced31f863a5c07',
    passer: '0x0e5b093bfee5021110e1b672bb169ae77503658f'
  }
}

export const networkToAssetData: { [networkId: number]: string } = {
  1: `0xf47261b0000000000000000000000000${networkToSatellitesContractAddresses[1].passer.slice(2)}`,
  4: `0xf47261b0000000000000000000000000${networkToSatellitesContractAddresses[4].passer.slice(2)}`
}
