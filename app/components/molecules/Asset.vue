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
        @click.stop="openDialog(3)"
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
              <v-text-field label="amount" placeholder="ETH"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click="closeDialog">
                Cancel
              </v-btn>
              <v-btn color="primary" flat @click="closeDialog">
                Confirm
              </v-btn>
            </v-card-actions>
          </div>
          <div v-if="dialogKey == 3">
            <v-card-title class="headline">Please confirm transaction on web3 wallet.</v-card-title>
          </div>
          <div v-if="dialogKey == 4">
            <v-card-title class="headline">Done!</v-card-title>
          </div>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { BaseContract } from '@0x/base-contract'
import { ContractAbi, TxData, SupportedProvider } from 'ethereum-types'
import { BigNumber, classUtils } from '@0x/utils'

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
  @Prop() asset
  openDialog(dialogKey) {
    this.dialogDisplay = true
    this.dialogKey = dialogKey
  }
  closeDialog() {
    this.dialogDisplay = false
  }
  gift() {
    this.dialogKey = 3
    const contract = new this.$web3.eth.Contract(this.$config.abi.erc721, this.asset.asset_contract.address)
    contract.methods
      .transferFrom(this.$store.state.address, this.asset.asset_contract.address, this.asset.token_id)
      .send({ from: this.$store.state.address })
      .on('transactionHash', (hash) => {
        this.dialogKey = 4
        console.log(hash)
      })
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
