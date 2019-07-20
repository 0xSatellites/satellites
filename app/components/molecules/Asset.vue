<template>
  <v-card flat>
    <nuxt-link
      :to="{
        name: 'asset-address-id',
        params: {
          address: asset.asset_contract.address,
          id: asset.token_id
        }
      }"
    >
      <v-img :src="asset.image_url" aspect-ratio="1"> </v-img>
      <v-card-title class="justify-center">
        <span class="grey--text">{{ asset.name }}</span>
      </v-card-title>
    </nuxt-link>
    <v-card-actions class="justify-center">
      <v-btn
        v-if="asset.owner.address !== this.$store.state.address && asset.order"
        small
        round
        color="primary"
        @click.stop="purchase"
        >{{ this.$web3.utils.fromWei(asset.order.takerAssetAmount.toString()) }} ETH<v-icon small right
          >add_shopping_cart</v-icon
        ></v-btn
      >
      <v-btn
        v-if="asset.owner.address === this.$store.state.address && asset.order"
        small
        round
        color="primary"
        @click.stop="openDialog(4)"
        >Cancel<v-icon small right>money_off</v-icon></v-btn
      >
      <v-btn
        v-if="asset.owner.address === this.$store.state.address && !asset.order"
        small
        round
        color="primary"
        @click.stop="openDialog(2)"
        >Sell<v-icon small right>attach_money</v-icon></v-btn
      >
      <v-btn
        v-if="asset.owner.address === this.$store.state.address && !asset.order"
        small
        round
        color="primary"
        @click.stop="openDialog(1)"
        >Gift<v-icon small right>card_giftcard</v-icon></v-btn
      >
    </v-card-actions>
    <v-layout row justify-center>
      <v-dialog v-model="dialogDisplay" max-width="500">
        <v-card class="pa-3">
          <div v-if="dialogKey == 1">
            <v-card-title class="headline">Input Receiver Address.</v-card-title>
            <v-card-text>
              <v-text-field v-model="giftToAddress" label="address" placeholder="0x..."></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click="closeDialog">
                Cancel
              </v-btn>
              <v-btn color="primary" flat @click="gift">
                Confirm
              </v-btn>
            </v-card-actions>
          </div>
          <div v-if="dialogKey == 2">
            <v-card-title class="headline">Input Price.</v-card-title>
            <v-card-text>
              <v-text-field v-model="takerAssetAmount" label="amount" placeholder="ETH"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click="closeDialog">
                Cancel
              </v-btn>
              <v-btn color="primary" flat @click="sell">
                Confirm
              </v-btn>
            </v-card-actions>
          </div>
          <div v-if="dialogKey == 3">
            <v-card-title class="headline">You must approve it.</v-card-title>
          </div>
          <div v-if="dialogKey == 4">
            <v-card-title class="headline">Please confirm transaction on web3 wallet.</v-card-title>
          </div>
          <div v-if="dialogKey == 5">
            <v-card-title class="headline">Done!</v-card-title>
          </div>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ContractAbi, TxData, SupportedProvider } from 'ethereum-types'
import {
  assetDataUtils,
  BigNumber,
  ContractWrappers,
  generatePseudoRandomSalt,
  MetamaskSubprovider,
  orderHashUtils,
  signatureUtils,
  Web3ProviderEngine
} from '0x.js'
import { BaseContract } from '@0x/base-contract'
import { HttpClient } from '@0x/connect'
import { getContractAddressesForNetworkOrThrow } from '@0x/contract-addresses'
import { classUtils } from '@0x/utils'
import { Web3Wrapper } from '@0x/web3-wrapper'

const httpClient = new HttpClient('http://35.200.51.207:3000/v2/')
const providerEngine = new Web3ProviderEngine()
const NETWORK_ID = 4
const DECIMALS = 18
const contractAddresses = getContractAddressesForNetworkOrThrow(NETWORK_ID)

export class DistributerContract extends BaseContract {
  constructor(abi: ContractAbi, address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>) {
    super('Bazaaar', abi, address, supportedProvider, txDefaults)
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

@Component
export default class Asset extends Vue {
  dialogDisplay = false
  dialogKey = 0
  giftToAddress = ''
  takerAssetAmount = 0
  @Prop() asset
  openDialog(dialogKey) {
    this.dialogDisplay = true
    this.dialogKey = dialogKey
  }
  closeDialog() {
    this.dialogDisplay = false
  }
  gift() {
    this.dialogKey = 4
    const contract = new this.$web3.eth.Contract(this.$config.abi.erc721, this.asset.asset_contract.address)
    contract.methods
      .transferFrom(this.$store.state.address, this.asset.asset_contract.address, this.asset.token_id)
      .send({ from: this.$store.state.address })
      .on('transactionHash', (hash) => {
        this.dialogKey = 5
        console.log(hash)
      })
  }
  async sell() {
    const contract = new this.$web3.eth.Contract(this.$config.abi.erc721, this.asset.asset_contract.address)

    const isApprovedForAll = await contract.methods
      .isApprovedForAll(this.$store.state.address, contractAddresses.erc721Proxy)
      .call()
    console.log(isApprovedForAll)
    if (!isApprovedForAll) {
      const contract = new this.$web3.eth.Contract(this.$config.abi.erc721, this.asset.asset_contract.address)
      await contract.methods
        .setApprovalForAll(contractAddresses.erc721Proxy, true)
        .send({ from: this.$store.state.address })
    } else {
      this.dialogKey = 4
      console.log('call')
      this.order()
    }
  }
  async order() {
    providerEngine.addProvider(new MetamaskSubprovider(this.$web3.currentProvider))
    providerEngine.start()
    const passerAddress = '0x0e5b093bfee5021110e1b672bb169ae77503658f'
    const makerAssetData = assetDataUtils.encodeERC721AssetData(this.asset.asset_contract.address, this.asset.token_id)
    const takerAssetData = assetDataUtils.encodeERC20AssetData(passerAddress)
    const expiration = new BigNumber(Math.round(9999999999999 / 1000) - 1)
    const salt = generatePseudoRandomSalt()
    const makerAssetAmount = new BigNumber(1)
    const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(this.takerAssetAmount), DECIMALS)
    const makerAddress = this.$store.state.address
    const takerAddress = '0x0000000000000000000000000000000000000000'
    const orderConfigRequest = {
      exchangeAddress: contractAddresses.exchange,
      makerAddress: makerAddress,
      takerAddress: takerAddress,
      expirationTimeSeconds: expiration,
      makerAssetData: makerAssetData,
      takerAssetData: takerAssetData,
      makerAssetAmount: makerAssetAmount,
      takerAssetAmount: takerAssetAmount
    }
    const orderConfig = await httpClient.getOrderConfigAsync(orderConfigRequest)
    const order = {
      salt: salt,
      ...orderConfigRequest,
      ...orderConfig
    }
    console.log(order)
    const orderHashHex = orderHashUtils.getOrderHashHex(order)
    console.log(providerEngine)
    const signature = await signatureUtils.ecSignHashAsync(providerEngine, orderHashHex, makerAddress)
    console.log(signature)
    const signedOrder = { ...order, signature }
    await httpClient.submitOrderAsync(signedOrder, { networkId: 4 })
  }
  async purchase() {
    providerEngine.addProvider(new MetamaskSubprovider(this.$web3.currentProvider))
    providerEngine.start()
    const contractWrappers = new ContractWrappers(providerEngine, { networkId: NETWORK_ID })
    const sraOrder = this.asset.order
    const taker = this.$store.state.address
    const encoder = await contractWrappers.exchange.transactionEncoderAsync()
    const data = await encoder.fillOrderTx(sraOrder, sraOrder.takerAssetAmount)
    const salt = sraOrder.salt
    const signerAddress = taker
    const transaction = {
      verifyingContractAddress: contractWrappers.exchange.address,
      salt,
      signerAddress,
      data
    }
    const web3Wrapper = new Web3Wrapper(window.web3.currentProvider)
    const provider = new MetamaskSubprovider(web3Wrapper.getProvider())
    const result = await signatureUtils.ecSignTypedDataTransactionAsync(provider, transaction, signerAddress)
    const normalizedTakerAddress = taker
    const abi = [
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
      {
        inputs: [{ name: '_passer', type: 'address' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'constructor'
      }
    ]
    const distributor = new DistributerContract(abi, '0x4618b3d9091387f6ebe2ab241dced31f863a5c07', provider)
    const feeRecipientAddresses = [
      '0x6183e0EA3727E40c770A28ebaD62A4F008543fe4',
      '0x607aea00bA3C2Cc23B65a7DA1F79BEC0c3Ad549E',
      '0x3004241A2FAC650Ef090809A51b3C735aB69c562'
    ]
    const fee1 = (sraOrder.takerAssetAmount / 100) * 3
    const fee2 = (sraOrder.takerAssetAmount / 100) * 3
    const fee3 = (sraOrder.takerAssetAmount / 100) * 4
    const totalFee = fee1 + fee2 + fee3
    const feeAmounts = [new BigNumber(fee1), new BigNumber(fee2), new BigNumber(fee3)]
    const totalFee1 = new BigNumber(totalFee)
    const takerAssetAmountPlus = sraOrder.takerAssetAmount.plus(totalFee1)
    await distributor.fillOrder.sendTransactionAsync(
      sraOrder,
      sraOrder.takerAssetAmount,
      salt,
      sraOrder.signature,
      result.signature,
      feeRecipientAddresses,
      feeAmounts,
      {
        value: takerAssetAmountPlus,
        from: normalizedTakerAddress,
        gas: 3000000,
        gasPrice: 100000000
      }
    )
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
