const NETWORK_ID = Number(process.env.NETWORK_ID) || 1
const RELAYER = process.env.RELAYER || 'https://mainnet.ookimaki.com/v2/'
const recipientAddress = process.env.RECIPIENT_ADDRESS || '0x6183e0EA3727E40c770A28ebaD62A4F008543fe4'
const feeRatio = Number(process.env.FEE_RARIO) || 900

const networkIdToInfura: { [networkId: number]: string } = {
  1: 'https://mainnet.infura.io/',
  4: 'https://rinkeby.infura.io/'
}

const networkIdToEtherscan: { [networkId: number]: string } = {
  1: 'https://etherscan.io/tx/',
  4: 'https://rinkeby.etherscan.io/tx/'
}

const networkIdToAPI: { [networkId: number]: string } = {
  1: `https://api.opensea.io/api/v1/`,
  4: `https://rinkeby-api.opensea.io/api/v1/`
}

const networkIdToTokens: { [networkId: number]: any[] } = {
  1: [
    {
      contract: '0xdceaf1652a131f32a821468dc03a92df0edd86ea',
      symbol: 'CK',
      name: 'CryptoKitties'
    }
  ],
  4: [
    {
      contract: '0xc106d47fb4bf5f9ebaf46e3219ef3fabcbd26606',
      symbol: 'CK',
      name: 'CryptoKitties'
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
  // 0 is satellitesAddress. This Fee goes to issueHunt and is returned to the developer.
  '0':{
    recipients: '0x5926824315aF6016f98E83De841C5B28b959DF51',
    ratio: 100
  },
  '1':{
    recipients: recipientAddress,
    ratio: feeRatio
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
  defaultRatio: feeRatio + addressToFee[0].ratio,
  feeBase: 10000,
  perBase: 100
}
