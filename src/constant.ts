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
    distributer: '0xd4d945E8965c819537FC3e92d42E4cd2D062377A',
    passer: '0xec36301d9fd340c7d5ae90eef6934351e1479f2b'
  }
}

export const networkToAssetData: { [networkId: number]: string } = {
  1: `0xf47261b0000000000000000000000000${networkToSatellitesContractAddresses[1].passer.slice(2)}`,
  4: `0xf47261b0000000000000000000000000${networkToSatellitesContractAddresses[4].passer.slice(2)}`
}
