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
import { classUtils } from '@0x/utils'
import { Web3Wrapper } from '@0x/web3-wrapper'
import Web3 from 'web3'

const NETWORK_ID = 4
const DECIMALS = 18
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

const distributer_abi = [ { "constant": false, "inputs": [ { "components": [ { "name": "makerAddress", "type": "address" }, { "name": "takerAddress", "type": "address" }, { "name": "feeRecipientAddress", "type": "address" }, { "name": "senderAddress", "type": "address" }, { "name": "makerAssetAmount", "type": "uint256" }, { "name": "takerAssetAmount", "type": "uint256" }, { "name": "makerFee", "type": "uint256" }, { "name": "takerFee", "type": "uint256" }, { "name": "expirationTimeSeconds", "type": "uint256" }, { "name": "salt", "type": "uint256" }, { "name": "makerAssetData", "type": "bytes" }, { "name": "takerAssetData", "type": "bytes" } ], "name": "order", "type": "tuple" }, { "name": "takerAssetFillAmount", "type": "uint256" }, { "name": "salt", "type": "uint256" }, { "name": "orderSignature", "type": "bytes" }, { "name": "takerSignature", "type": "bytes" }, { "name": "feeRecipientsAddresses", "type": "address[]" }, { "name": "feeAmounts", "type": "uint256[]" } ], "name": "fillOrder", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "relayerRatio", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "ratioBase", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "passer", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [ { "name": "_passer", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" } ]
const passer_abi = [ { "constant": false, "inputs": [ { "name": "guy", "type": "address" }, { "name": "wad", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "components": [ { "name": "makerAddress", "type": "address" }, { "name": "takerAddress", "type": "address" }, { "name": "feeRecipientAddress", "type": "address" }, { "name": "senderAddress", "type": "address" }, { "name": "makerAssetAmount", "type": "uint256" }, { "name": "takerAssetAmount", "type": "uint256" }, { "name": "makerFee", "type": "uint256" }, { "name": "takerFee", "type": "uint256" }, { "name": "expirationTimeSeconds", "type": "uint256" }, { "name": "salt", "type": "uint256" }, { "name": "makerAssetData", "type": "bytes" }, { "name": "takerAssetData", "type": "bytes" } ], "name": "order", "type": "tuple" }, { "name": "takerAssetFillAmount", "type": "uint256" }, { "name": "salt", "type": "uint256" }, { "name": "orderSignature", "type": "bytes" }, { "name": "takerSignature", "type": "bytes" } ], "name": "fillOrder", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "src", "type": "address" }, { "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_erc20proxy", "type": "address" }, { "name": "_exchange", "type": "address" } ], "name": "updateAuthorizedAddress", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "name": "_erc20proxy", "type": "address" }, { "name": "_exchange", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "guy", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "erc20proxy", "type": "address" }, { "indexed": true, "name": "exchange", "type": "address" } ], "name": "UpdateAuthorizedAddress", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "constant": true, "inputs": [ { "name": "", "type": "address" }, { "name": "", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "erc20proxy", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "exchange", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "isOwner", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ]
const erc721_abi = [{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_approved","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_operator","type":"address"},{"name":"_approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"},{"name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":true,"name":"_tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_approved","type":"address"},{"indexed":true,"name":"_tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_operator","type":"address"},{"indexed":false,"name":"_approved","type":"bool"}],"name":"ApprovalForAll","type":"event"}]

interface SatellitesContractAddresses {
  distributer: string;
  passer: string;
}

interface refinedOrders {
  [address: string]: {
    [tokenId: string]: SignedOrder
  };
}

const networkToAddresses: { [networkId: number]: SatellitesContractAddresses } = {
  1: {
    distributer: '0x080bf510fcbf18b91105470639e9561022937712',
    passer: '0x95e6f48254609a6ee006f7d493c8e5fb97094cef',
  },
  4: {
    distributer: '0x4618b3d9091387f6ebe2ab241dced31f863a5c07',
    passer: '0x0e5b093bfee5021110e1b672bb169ae77503658f',
  }
};

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
  public web3: Web3

  constructor(networkId: number, supportedProvider: SupportedProvider, relayer?: string, txDefaults?: Partial<TxData>) {
    this.networkId = networkId
    this.supportedProvider = supportedProvider
    this.httpClient = new HttpClient(relayer || 'http://35.200.51.207:3000/v2/')
    this.distributor = new DistributerContract(distributer_abi, networkToAddresses[networkId].distributer, supportedProvider, txDefaults)
    this.passer = new PasserContract(passer_abi, networkToAddresses[networkId].passer, supportedProvider, txDefaults)
    this.web3 = new Web3(supportedProvider)
    this.contractAddresses = getContractAddressesForNetworkOrThrow(NETWORK_ID)
    this.providerEngine = new Web3ProviderEngine()
    this.providerEngine.addProvider(new MetamaskSubprovider(supportedProvider))
    this.providerEngine.start()
    this.contractWrappers = new ContractWrappers(this.providerEngine, { networkId: networkId })
  }

  async sell(makerAddress: string, contractAddress: string, tokenId: number, price: number){
    const makerAssetData = assetDataUtils.encodeERC721AssetData(contractAddress, new BigNumber(tokenId))
    const takerAssetData = assetDataUtils.encodeERC20AssetData(networkToAddresses[this.networkId].passer)
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

    const web3Wrapper = new Web3Wrapper(this.supportedProvider)
    const provider = new MetamaskSubprovider(web3Wrapper.getProvider())
    const signedOrder = await signatureUtils.ecSignTypedDataOrderAsync(provider, order, makerAddress)
    await this.httpClient.submitOrderAsync(signedOrder, { networkId: this.networkId })
  }

  async buy(takerAddress: string, signedOrder:SignedOrder, feeRecipientAddresses?: string[], feeAmounts?: number[]){
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
    const web3Wrapper = new Web3Wrapper(this.supportedProvider)
    const provider = new MetamaskSubprovider(web3Wrapper.getProvider())
    const result = await signatureUtils.ecSignTypedDataTransactionAsync(provider, transaction, signerAddress)
    const normalizedTakerAddress = takerAddress

    let totalFee: BigNumber = new BigNumber(0)
    let feeAmountsBigNumber: BigNumber[] = []
    if(feeRecipientAddresses && feeAmounts) {
      for(let i=0; i<feeAmounts.length; i++){
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
          gas: 4000000,
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
          gas: 4000000,
        }
      )
    }
  }

  async getOrders(){
    const orders = await this.httpClient.getOrdersAsync({ networkId: this.networkId })
    const refinedOrders: refinedOrders = {}
    for (const order of orders.records) {
      const assetData = assetDataUtils.decodeERC721AssetData(order.order.makerAssetData)
      const tokenId = assetData.tokenId.toString()
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
    return refinedOrders
  }

  async getOrder(assetContractAddress: string, tokenId: number){
    const assetData = assetDataUtils.encodeERC721AssetData(assetContractAddress, new BigNumber(tokenId))
    const orderbookRequest = {
      baseAssetData: assetData,
      quoteAssetData: '0xf47261b00000000000000000000000000e5b093bfee5021110e1b672bb169ae77503658f'
    }
    const orderBooks = await this.httpClient.getOrderbookAsync(orderbookRequest, {
      networkId: this.networkId
    })
    let order = null
    for (const record of orderBooks.asks.records) {
      if (!order) {
        order = record.order
      } else if (order.takerAssetAmount > record.order.takerAssetAmount) {
        order = record.order
      }
    }
    return order
  }

  erc721(contractAddress: string) {
    return new this.web3.eth.Contract(erc721_abi, contractAddress)
  }
}
