const NETWORK_ID = Number(process.env.NETWORK_ID) || 1
const RELAYER = process.env.RELAYER || 'https://mainnet.ookimaki.com/v2/'

const networkIdToInfura: { [networkId: number]: string } = {
  1: 'https://mainnet.rinkeby.infura.io/',
  4: 'https://rinkeby.infura.io/'
}

const networkIdToEtherscan: { [networkId: number]: string } = {
  1: 'https://etherscan.io/tx/',
  4: 'https://rinkeby.etherscan.io/tx/'
}

const networkIdToAPI: { [networkId: number]: string } = {
  1: `https://asia-northeast1-blockbase-bazaaar-sand.cloudfunctions.net/`,
  4: `https://rinkeby-api.opensea.io/api/v1/assets`
}

const networkIdToTokens: { [networkId: number]: any[] } = {
  1: [
    {
      contract: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
      symbol: 'CK',
      name: 'CryptoKitties'
    },
    {
      contract: '0x1a94fce7ef36bc90959e206ba569a12afbc91ca1',
      symbol: 'CTN',
      name: 'Crypt-Oink'
    },
    {
      contract: '0x273f7f8e6489682df756151f5525576e322d51a3',
      symbol: 'MCHH',
      name: 'MyCryptoHeroes:Hero'
    },
    {
      contract: '0xdceaf1652a131f32a821468dc03a92df0edd86ea',
      symbol: 'MCHE',
      name: 'MyCryptoHeroes:Extensions'
    },
    {
      contract: '0xfac7bea255a6990f749363002136af6556b31e04',
      symbol: 'ENS',
      name: 'Ether Name Service'
    },
    {
      contract: '0x79986af15539de2db9a5086382daeda917a9cf0c',
      symbol: 'CVPA',
      name: 'Cryptovoxels Parcel'
    }
  ],
  4: [
    {
      contract: '0xc106d47fb4bf5f9ebaf46e3219ef3fabcbd26606',
      symbol: 'CK',
      name: 'CryptoKitties'
    },
    {
      contract: '0x5220debd5a575d1bf85b5531c9e0f6ced243975c',
      symbol: 'CTN',
      name: 'Crypt-Oink'
    },
    {
      contract: '0x16baf0de678e52367adc69fd067e5edd1d33e3bf',
      symbol: 'MyCryptoHeroes:Hero',
      name: 'MCHH'
    },
    {
      contract: '0x587ae915d4ccaa5c2220c638069f2605e1f7404c',
      symbol: 'MyCryptoHeroes:Extensions',
      name: 'MCHE'
    }
  ]
}

const networkIdToExceptions = {
  1: {
    '0x06012c8cf97bead5deae237070f9587f8e7a266d': [
      {
        constant: true,
        inputs: [{ name: '', type: 'uint256' }],
        name: 'kittyIndexToApproved',
        outputs: [{ name: '', type: 'address' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: '_approved',
            type: 'address'
          },
          {
            name: '_tokenId',
            type: 'uint256'
          }
        ],
        name: 'approve',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function'
      }
    ],
    '0x1a94fce7ef36bc90959e206ba569a12afbc91ca1': [
      {
        constant: true,
        inputs: [{ name: '', type: 'uint256' }],
        name: 'entityIndexToApproved',
        outputs: [{ name: '', type: 'address' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: '_approved',
            type: 'address'
          },
          {
            name: '_tokenId',
            type: 'uint256'
          }
        ],
        name: 'approve',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function'
      }
    ]
  },
  4: {
    '0x16baf0de678e52367adc69fd067e5edd1d33e3bf': [
      {
        constant: true,
        inputs: [{ name: '', type: 'uint256' }],
        name: 'kittyIndexToApproved',
        outputs: [{ name: '', type: 'address' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: '_approved',
            type: 'address'
          },
          {
            name: '_tokenId',
            type: 'uint256'
          }
        ],
        name: 'approve',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function'
      }
    ],
    '0x587ae915d4ccaa5c2220c638069f2605e1f7404c': [
      {
        constant: true,
        inputs: [{ name: '', type: 'uint256' }],
        name: 'entityIndexToApproved',
        outputs: [{ name: '', type: 'address' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: '_approved',
            type: 'address'
          },
          {
            name: '_tokenId',
            type: 'uint256'
          }
        ],
        name: 'approve',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function'
      }
    ]
  }
}

const addressToFee = {
  '0x1a94fce7ef36bc90959e206ba569a12afbc91ca1': {
    recipients: '0x5926824315aF6016f98E83De841C5B28b959DF51',
    ratio: 1000
  },
  '0x273f7f8e6489682df756151f5525576e322d51a3': {
    recipients: '0x070c22f0887bd1836A1E7C9ae0cd88108e0ECB19',
    ratio: 1000
  },
  '0xdceaf1652a131f32a821468dc03a92df0edd86ea': {
    recipients: '0x070c22f0887bd1836A1E7C9ae0cd88108e0ECB19',
    ratio: 1000
  }
}

const whitelists: any[] = []
for (let i = 0; i < networkIdToTokens[NETWORK_ID].length; i++) {
  whitelists.push(networkIdToTokens[NETWORK_ID][i].contract)
}

export const config = {
  networkId: NETWORK_ID,
  relayer: RELAYER,
  exceptions: networkIdToExceptions[NETWORK_ID],
  infura: networkIdToInfura[NETWORK_ID],
  etherscan: networkIdToEtherscan[NETWORK_ID],
  api: networkIdToAPI[NETWORK_ID],
  tokens: networkIdToTokens[NETWORK_ID],
  whitelists: whitelists,
  addressToFee: addressToFee,
  blockbaseAddress: '0xf9b744152a6897198b9B9999d8d340b59807595E',
  defaultRatio: 500,
  feeBase: 10000,
  perBase: 100
}
