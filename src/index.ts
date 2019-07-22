import { ContractAbi, TxData, SupportedProvider } from 'ethereum-types'
import {
  assetDataUtils,
  BigNumber,
  ContractWrappers,
  generatePseudoRandomSalt,
  MetamaskSubprovider,
  signatureUtils,
  Web3ProviderEngine,
  SignedOrder
} from '0x.js'
import { BaseContract } from '@0x/base-contract'
import { HttpClient } from '@0x/connect'
import { ContractAddresses, getContractAddressesForNetworkOrThrow } from '@0x/contract-addresses'
import { ERC20TokenWrapper, ERC20ProxyWrapper, ERC721ProxyWrapper, ERC721TokenWrapper, ExchangeWrapper } from '@0x/contract-wrappers'
import { classUtils } from '@0x/utils'
import { Web3Wrapper } from '@0x/web3-wrapper'

import axios from 'axios'

const DECIMALS = 18
const GAS_LIMIT = 4000000
const DEFAULT_RELAYER = 'http://35.200.51.207:3000/v2/'
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'

const distributer_abi = [
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
const passer_abi = [
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

interface SatellitesContractAddresses {
  distributer: string
  passer: string
}

interface RefinedOrders {
  [address: string]: {
    [tokenId: string]: SignedOrder
  }
}

const networkToSatellitesContractAddresses: { [networkId: number]: SatellitesContractAddresses } = {
  1: {
    distributer: '0x080bf510fcbf18b91105470639e9561022937712',
    passer: '0x95e6f48254609a6ee006f7d493c8e5fb97094cef'
  },
  4: {
    distributer: '0x4618b3d9091387f6ebe2ab241dced31f863a5c07',
    passer: '0x0e5b093bfee5021110e1b672bb169ae77503658f'
  }
}

const networkToSquoteAssetData: { [networkId: number]: string } = {
  1: `0xf47261b0000000000000000000000000${networkToSatellitesContractAddresses[1].passer.slice(2)}`,
  4: `0xf47261b0000000000000000000000000${networkToSatellitesContractAddresses[4].passer.slice(2)}`
}

const networkToAssetMetadataAPIBase: { [networkId: number]: string } = {
  1: `https://api.opensea.io/api/v1/assets`,
  4: `https://rinkeby-api.opensea.io/api/v1/assets`
}

//  Classes
class DistributerContract extends BaseContract {
  constructor(abi: ContractAbi, address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>) {
    super('Distributer', abi, address, supportedProvider, txDefaults)
    classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper'])
  }
  public fillOrder = {
    async sendTransactionAsync(
      order: {
        makerAddress: string
        takerAddress: string
        feeRecipientAddress: string
        senderAddress: string
        makerAssetAmount: BigNumber
        takerAssetAmount: BigNumber
        makerFee: BigNumber
        takerFee: BigNumber
        expirationTimeSeconds: BigNumber
        salt: BigNumber
        makerAssetData: string
        takerAssetData: string
      },
      takerAssetFillAmount: BigNumber,
      salt: BigNumber,
      orderSignature: string,
      takerSignature: string,
      feeRecipientAddresses: string[],
      feeAmountsBigNumber: BigNumber[],
      txData?: Partial<TxData> | undefined
    ): Promise<string> {
      const self = (this as any) as DistributerContract
      const encodedData = self._strictEncodeArguments(
        'fillOrder((address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bytes,bytes),uint256,uint256,bytes,bytes,address[],uint256[])',
        [order, takerAssetFillAmount, salt, orderSignature, takerSignature, feeRecipientAddresses, feeAmountsBigNumber]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    }
  }
}

class PasserContract extends BaseContract {
  constructor(abi: ContractAbi, address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>) {
    super('Passer', abi, address, supportedProvider, txDefaults)
    classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper'])
  }
  public fillOrder = {
    async sendTransactionAsync(
      order: {
        makerAddress: string
        takerAddress: string
        feeRecipientAddress: string
        senderAddress: string
        makerAssetAmount: BigNumber
        takerAssetAmount: BigNumber
        makerFee: BigNumber
        takerFee: BigNumber
        expirationTimeSeconds: BigNumber
        salt: BigNumber
        makerAssetData: string
        takerAssetData: string
      },
      takerAssetFillAmount: BigNumber,
      salt: BigNumber,
      orderSignature: string,
      takerSignature: string,
      txData?: Partial<TxData> | undefined
    ): Promise<string> {
      const self = (this as any) as PasserContract
      const encodedData = self._strictEncodeArguments(
        'fillOrder((address,address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bytes,bytes),uint256,uint256,bytes,bytes)',
        [order, takerAssetFillAmount, salt, orderSignature, takerSignature]
      )
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults()
      )
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults)
      return txHash
    }
  }
}

export default class Satellites {
  public networkId: number
  public supportedProvider: SupportedProvider
  public httpClient: HttpClient
  public distributor: DistributerContract
  public passer: PasserContract
  public contractAddresses: ContractAddresses
  public providerEngine: Web3ProviderEngine
  public contractWrappers: ContractWrappers
  public web3Wrapper: Web3Wrapper
  public erc20Proxy: ERC20ProxyWrapper
  public erc20Token: ERC20TokenWrapper
  public erc721Proxy: ERC721ProxyWrapper
  public erc721Token: ERC721TokenWrapper
  public exchangeWrapper: ExchangeWrapper
  public apiBase: string
  public whitelists: string[] | undefined

  constructor(networkId: number, supportedProvider: SupportedProvider, relayer?: string, whitelists?: string[], txDefaults?: Partial<TxData>) {
    this.networkId = networkId
    this.supportedProvider = supportedProvider
    this.httpClient = new HttpClient(relayer || DEFAULT_RELAYER)
    this.distributor = new DistributerContract(
      distributer_abi,
      networkToSatellitesContractAddresses[this.networkId].distributer,
      supportedProvider,
      txDefaults
    )
    this.passer = new PasserContract(passer_abi, networkToSatellitesContractAddresses[this.networkId].passer, supportedProvider, txDefaults)
    this.contractAddresses = getContractAddressesForNetworkOrThrow(this.networkId)
    this.providerEngine = new Web3ProviderEngine()
    this.providerEngine.addProvider(new MetamaskSubprovider(supportedProvider))
    this.providerEngine.start()
    this.contractWrappers = new ContractWrappers(this.providerEngine, { networkId: this.networkId })
    this.web3Wrapper = new Web3Wrapper(supportedProvider)
    this.erc20Proxy = new ERC20ProxyWrapper(this.web3Wrapper, this.networkId, this.contractAddresses.erc20Proxy);
    this.erc20Token = new ERC20TokenWrapper(
      this.web3Wrapper,
      this.networkId,
      this.erc20Proxy
    )
    this.erc721Proxy = new ERC721ProxyWrapper(this.web3Wrapper, this.networkId, this.contractAddresses.erc721Proxy);
    this.erc721Token = new ERC721TokenWrapper(
      this.web3Wrapper,
      this.networkId,
      this.erc721Proxy
    )
    this.exchangeWrapper = new ExchangeWrapper(this.web3Wrapper, this.networkId, this.erc20Token, this.erc721Token)
    this.apiBase = networkToAssetMetadataAPIBase[this.networkId]
    this.whitelists = null || whitelists
  }

  async sell(makerAddress: string, contractAddress: string, tokenId: number, price: number) {
    const makerAssetData = assetDataUtils.encodeERC721AssetData(contractAddress, new BigNumber(tokenId))
    const takerAssetData = assetDataUtils.encodeERC20AssetData(networkToSatellitesContractAddresses[this.networkId].passer)
    const expiration = new BigNumber(Math.round(9999999999999 / 1000) - 1)
    const salt = generatePseudoRandomSalt()
    const makerAssetAmount = new BigNumber(1)
    const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(price), DECIMALS)
    const takerAddress = NULL_ADDRESS
    const orderConfigRequest = {
      exchangeAddress: this.contractAddresses.exchange,
      makerAddress: makerAddress,
      takerAddress: takerAddress,
      expirationTimeSeconds: expiration,
      makerAssetData: makerAssetData,
      takerAssetData: takerAssetData,
      makerAssetAmount: makerAssetAmount,
      takerAssetAmount: takerAssetAmount
    }
    const orderConfig = await this.httpClient.getOrderConfigAsync(orderConfigRequest)
    const order = {
      salt: salt,
      ...orderConfigRequest,
      ...orderConfig
    }

    const provider = new MetamaskSubprovider(this.web3Wrapper.getProvider())
    const signedOrder = await signatureUtils.ecSignTypedDataOrderAsync(provider, order, makerAddress)
    await this.httpClient.submitOrderAsync(signedOrder, { networkId: this.networkId })
  }

  async buy(takerAddress: string, signedOrder: SignedOrder, feeRecipientAddresses?: string[], feeAmounts?: number[]) {
    const encoder = await this.contractWrappers.exchange.transactionEncoderAsync()
    const data = await encoder.fillOrderTx(signedOrder, signedOrder.takerAssetAmount)
    const salt = signedOrder.salt
    const signerAddress = takerAddress

    const transaction = {
      verifyingContractAddress: this.contractAddresses.exchange,
      salt,
      signerAddress,
      data
    }

    const provider = new MetamaskSubprovider(this.web3Wrapper.getProvider())
    const result = await signatureUtils.ecSignTypedDataTransactionAsync(provider, transaction, signerAddress)
    const normalizedTakerAddress = takerAddress

    let totalFee: BigNumber = new BigNumber(0)
    let feeAmountsBigNumber: BigNumber[] = []
    if (feeRecipientAddresses && feeAmounts) {
      for (let i = 0; i < feeAmounts.length; i++) {
        feeAmountsBigNumber.push(new BigNumber(feeAmounts[i]))
        totalFee = feeAmountsBigNumber[i].plus(totalFee)
      }
      const amountWithFee = signedOrder.takerAssetAmount.plus(totalFee)
      await this.distributor.fillOrder.sendTransactionAsync(
        signedOrder,
        signedOrder.takerAssetAmount,
        salt,
        signedOrder.signature,
        result.signature,
        feeRecipientAddresses,
        feeAmountsBigNumber,
        {
          value: amountWithFee,
          from: normalizedTakerAddress,
          gas: GAS_LIMIT
        }
      )
    } else {
      await this.passer.fillOrder.sendTransactionAsync(
        signedOrder,
        signedOrder.takerAssetAmount,
        salt,
        signedOrder.signature,
        result.signature,
        {
          value: signedOrder.takerAssetAmount,
          from: normalizedTakerAddress,
          gas: GAS_LIMIT
        }
      )
    }
  }

  async cancel(signedOrder: SignedOrder) {
    await this.exchangeWrapper.cancelOrderAsync(signedOrder)
  }

  async gift(tokenAddress: string, receiverAddress: string, senderAddress: string, tokenId: number) {
    await this.erc721Token.transferFromAsync(tokenAddress, receiverAddress, senderAddress, new BigNumber(tokenId))
  }

  async getOrders() {
    const orders = await this.httpClient.getOrdersAsync({ networkId: this.networkId })
    const refinedOrders: RefinedOrders = {}
    for (const order of orders.records) {
      const assetData = assetDataUtils.decodeERC721AssetData(order.order.makerAssetData)
      const tokenId = assetData.tokenId.toString()

      if(!this.whitelists || this.whitelists.includes(assetData.tokenAddress)) {
        if (!refinedOrders[assetData.tokenAddress]) {
          refinedOrders[assetData.tokenAddress] = {}
        }
        if (
          !refinedOrders[assetData.tokenAddress][tokenId] ||
          refinedOrders[assetData.tokenAddress][tokenId].takerAssetAmount > order.order.takerAssetAmount
        ) {
          refinedOrders[assetData.tokenAddress][tokenId] = order.order
        }
      }
    }
    return refinedOrders
  }

  async getAssetDataForOrders(refinedOrders: RefinedOrders) {
    const metadataPromises:any = []
    for (const tokenAddress in refinedOrders) {
      let requestURL = `${this.apiBase}?asset_contract_address=${tokenAddress}`
      for (const tokenId in refinedOrders[tokenAddress]) {
        requestURL = `${requestURL}&token_ids=${tokenId}`
      }
      metadataPromises.push(axios.get(requestURL))
    }
    const metadataResolved = await Promise.all(metadataPromises)
    const assets:any = []
    for (const metadataPerAsset of metadataResolved) {
      for (const metadata of (metadataPerAsset as any).data.assets) {
        const asset = metadata
        if (refinedOrders[metadata.asset_contract.address][metadata.token_id]) {
          asset.order = refinedOrders[metadata.asset_contract.address][metadata.token_id]
        }
        assets.push(asset)
      }
    }
    return assets
  }

  async getOrder(assetContractAddress: string, tokenId: number) {
    let order: SignedOrder | undefined
    let price: BigNumber
    if(!this.whitelists || this.whitelists.includes(assetContractAddress)) {
      const assetData = assetDataUtils.encodeERC721AssetData(assetContractAddress, new BigNumber(tokenId))
      const orderbookRequest = {
        baseAssetData: assetData,
        quoteAssetData: networkToSquoteAssetData[this.networkId]
      }
      const orderBooks = await this.httpClient.getOrderbookAsync(orderbookRequest, {
        networkId: this.networkId
      })
      orderBooks.asks.records.forEach((record, index) => {
        if (index === 0) {
          order = record.order
          price = record.order.takerAssetAmount
        } else if (price > record.order.takerAssetAmount) {
          order = record.order
        }
      })
    }
    return order
  }

  async getAssetData(assetContractAddress: string, tokenId: number) {
    const asset = await axios.get(
      `${this.apiBase}?token_ids=${tokenId}&asset_contract_address=${assetContractAddress}`
    )
    const assets = asset.data.assets
    return assets[0]
  }

  async getAssetDataForOwner(owner: string){
    let assetContractAddressesQuery = ''
    if(this.whitelists) {
      const base = '&asset_contract_addresses='
      for (const assetContractAddress of this.whitelists) {
        assetContractAddressesQuery = assetContractAddressesQuery + base + assetContractAddress
      }
    }
    const assets = await axios.get(
      `${this.apiBase}?order_by=token_id&owner=${owner}${assetContractAddressesQuery}`
    )
    return assets.data.assets
  }

}
