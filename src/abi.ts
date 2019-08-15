export const distributerAbi = [
  {
    constant: false,
    inputs: [
      {
        components: [
          { name: 'makerAddress', type: 'address' },
          { name: 'takerAddress', type: 'address' },
          { name: 'feeRecipientAddress', type: 'address' },
          { name: 'senderAddress', type: 'address' },
          { name: 'makerAssetAmount', type: 'uint256' },
          { name: 'takerAssetAmount', type: 'uint256' },
          { name: 'makerFee', type: 'uint256' },
          { name: 'takerFee', type: 'uint256' },
          { name: 'expirationTimeSeconds', type: 'uint256' },
          { name: 'salt', type: 'uint256' },
          { name: 'makerAssetData', type: 'bytes' },
          { name: 'takerAssetData', type: 'bytes' }
        ],
        name: 'order',
        type: 'tuple'
      },
      { name: 'takerAssetFillAmount', type: 'uint256' },
      { name: 'salt', type: 'uint256' },
      { name: 'orderSignature', type: 'bytes' },
      { name: 'takerSignature', type: 'bytes' },
      { name: 'feeRecipientsAddresses', type: 'address[]' },
      { name: 'feeAmounts', type: 'uint256[]' }
    ],
    name: 'fillOrder',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'relayerRatio',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'ratioBase',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'passer',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  { inputs: [{ name: '_passer', type: 'address' }], payable: false, stateMutability: 'nonpayable', type: 'constructor' }
]

export const passerAbi = [
  {
    constant: false,
    inputs: [{ name: 'guy', type: 'address' }, { name: 'wad', type: 'uint256' }],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        components: [
          { name: 'makerAddress', type: 'address' },
          { name: 'takerAddress', type: 'address' },
          { name: 'feeRecipientAddress', type: 'address' },
          { name: 'senderAddress', type: 'address' },
          { name: 'makerAssetAmount', type: 'uint256' },
          { name: 'takerAssetAmount', type: 'uint256' },
          { name: 'makerFee', type: 'uint256' },
          { name: 'takerFee', type: 'uint256' },
          { name: 'expirationTimeSeconds', type: 'uint256' },
          { name: 'salt', type: 'uint256' },
          { name: 'makerAssetData', type: 'bytes' },
          { name: 'takerAssetData', type: 'bytes' }
        ],
        name: 'order',
        type: 'tuple'
      },
      { name: 'takerAssetFillAmount', type: 'uint256' },
      { name: 'salt', type: 'uint256' },
      { name: 'orderSignature', type: 'bytes' },
      { name: 'takerSignature', type: 'bytes' }
    ],
    name: 'fillOrder',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'dst', type: 'address' }, { name: 'wad', type: 'uint256' }],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'src', type: 'address' }, { name: 'dst', type: 'address' }, { name: 'wad', type: 'uint256' }],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_erc20proxy', type: 'address' }, { name: '_exchange', type: 'address' }],
    name: 'updateAuthorizedAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: '_erc20proxy', type: 'address' }, { name: '_exchange', type: 'address' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'src', type: 'address' },
      { indexed: true, name: 'guy', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'src', type: 'address' },
      { indexed: true, name: 'dst', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'erc20proxy', type: 'address' },
      { indexed: true, name: 'exchange', type: 'address' }
    ],
    name: 'UpdateAuthorizedAddress',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'previousOwner', type: 'address' },
      { indexed: true, name: 'newOwner', type: 'address' }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    constant: true,
    inputs: [{ name: '', type: 'address' }, { name: '', type: 'address' }],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'erc20proxy',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'exchange',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'isOwner',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
]
