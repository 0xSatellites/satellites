import { TxData, SupportedProvider } from 'ethereum-types'
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
import { HttpClient } from '@0x/connect'
import { ContractAddresses, getContractAddressesForNetworkOrThrow } from '@0x/contract-addresses'
import {
  ERC20TokenWrapper,
  ERC20ProxyWrapper,
  ERC721ProxyWrapper,
  ERC721TokenWrapper,
  ExchangeWrapper
} from '@0x/contract-wrappers'
import { Web3Wrapper } from '@0x/web3-wrapper'

import { distributerAbi, passerAbi } from './abi'
import { DECIMALS, GAS_LIMIT, NULL_ADDRESS, networkToSatellitesContractAddresses, networkToAssetData } from './constant'
import { DistributerContract } from './distributer'
import { PasserContract } from './passer'
import { RefinedOrders } from './interface'

export class Satellites {
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
  public whitelists: string[] | undefined

  constructor(networkId: number, supportedProvider: SupportedProvider, relayer: string, txDefaults?: Partial<TxData>) {
    this.networkId = networkId
    this.supportedProvider = supportedProvider
    this.httpClient = new HttpClient(relayer)
    this.distributor = new DistributerContract(
      distributerAbi,
      networkToSatellitesContractAddresses[this.networkId].distributer,
      supportedProvider,
      txDefaults
    )
    this.passer = new PasserContract(
      passerAbi,
      networkToSatellitesContractAddresses[this.networkId].passer,
      supportedProvider,
      txDefaults
    )
    this.contractAddresses = getContractAddressesForNetworkOrThrow(this.networkId)
    this.providerEngine = new Web3ProviderEngine()
    this.providerEngine.addProvider(new MetamaskSubprovider(supportedProvider))
    this.providerEngine.start()
    this.contractWrappers = new ContractWrappers(this.providerEngine, { networkId: this.networkId })
    this.web3Wrapper = new Web3Wrapper(supportedProvider)
    this.erc20Proxy = new ERC20ProxyWrapper(this.web3Wrapper, this.networkId, this.contractAddresses.erc20Proxy)
    this.erc20Token = new ERC20TokenWrapper(this.web3Wrapper, this.networkId, this.erc20Proxy)
    this.erc721Proxy = new ERC721ProxyWrapper(this.web3Wrapper, this.networkId, this.contractAddresses.erc721Proxy)
    this.erc721Token = new ERC721TokenWrapper(this.web3Wrapper, this.networkId, this.erc721Proxy)
    this.exchangeWrapper = new ExchangeWrapper(this.web3Wrapper, this.networkId, this.erc20Token, this.erc721Token)
  }

  async sell(makerAddress: string, contractAddress: string, tokenId: number, price: number) {
    const makerAssetData = assetDataUtils.encodeERC721AssetData(contractAddress, new BigNumber(tokenId))
    const takerAssetData = assetDataUtils.encodeERC20AssetData(
      networkToSatellitesContractAddresses[this.networkId].passer
    )
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
    return await this.httpClient.submitOrderAsync(signedOrder, { networkId: this.networkId })
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
      return await this.distributor.fillOrder.sendTransactionAsync(
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
      return await this.passer.fillOrder.sendTransactionAsync(
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
    return await this.exchangeWrapper.cancelOrderAsync(signedOrder)
  }

  async gift(tokenAddress: string, receiverAddress: string, senderAddress: string, tokenId: number) {
    return await this.erc721Token.transferFromAsync(
      tokenAddress,
      receiverAddress,
      senderAddress,
      new BigNumber(tokenId)
    )
  }

  async getOrders(tokenAddresses?: string[]) {
    const orders = await this.httpClient.getOrdersAsync({ networkId: this.networkId })
    const refinedOrders: RefinedOrders = {}
    for (const order of orders.records) {
      const assetData = assetDataUtils.decodeERC721AssetData(order.order.makerAssetData)
      const tokenId = assetData.tokenId.toString()
      if (!this.whitelists || this.whitelists.includes(assetData.tokenAddress)) {
        if (!tokenAddresses || tokenAddresses.length === 0 || tokenAddresses.includes(assetData.tokenAddress)) {
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
    }
    return refinedOrders
  }

  async getOrder(assetContractAddress: string, tokenId: number) {
    let order: SignedOrder | undefined
    let price: BigNumber
    if (!this.whitelists || this.whitelists.includes(assetContractAddress)) {
      const assetData = assetDataUtils.encodeERC721AssetData(assetContractAddress, new BigNumber(tokenId))
      const orderbookRequest = {
        baseAssetData: assetData,
        quoteAssetData: networkToAssetData[this.networkId]
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
}
