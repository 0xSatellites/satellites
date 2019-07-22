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
        @click.stop="executeBuy"
        >{{ this.$web3.utils.fromWei(asset.order.takerAssetAmount.toString()) }} ETH<v-icon small right
          >add_shopping_cart</v-icon
        ></v-btn
      >
      <v-btn
        v-if="asset.owner.address === this.$store.state.address && asset.order"
        small
        round
        color="primary"
        @click.stop="executeCancel"
        >Cancel<v-icon small right>money_off</v-icon></v-btn
      >
      <v-btn
        v-if="asset.owner.address === this.$store.state.address && !asset.order"
        small
        round
        color="primary"
        @click.stop="sell"
        >Sell<v-icon small right>attach_money</v-icon></v-btn
      >
      <v-btn
        v-if="asset.owner.address === this.$store.state.address && !asset.order"
        small
        round
        color="primary"
        @click.stop="gift"
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
              <v-btn color="primary" flat @click="executeGift">
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
              <v-btn color="primary" flat @click="executeSell">
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
            <v-card-title class="headline">Signature</v-card-title>
          </div>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Asset extends Vue {
  dialogDisplay = false
  dialogKey = 0
  giftToAddress = ''
  takerAssetAmount = 0
  @Prop() asset
  mounted() {}
  openDialog(dialogKey) {
    this.dialogDisplay = true
    this.dialogKey = dialogKey
  }
  closeDialog() {
    this.dialogDisplay = false
  }
  gift() {
    this.openDialog(1)
  }
  executeGift() {
    this.openDialog(4)
    this.$satellites.gift(
      this.asset.asset_contract.address,
      this.giftToAddress,
      this.$store.state.address,
      this.asset.token_id
    )
  }
  async sell() {
    const isApprovedForAll = await this.$satellites.erc721Token.isApprovedForAllAsync(
      this.asset.asset_contract.address,
      this.$store.state.address,
      this.$satellites.contractAddresses.erc721Proxy
    )
    if (!isApprovedForAll) {
      await this.executeApprove()
    } else {
      this.openDialog(2)
    }
  }

  async executeSell() {
    this.openDialog(5)
    await this.$satellites.sell(
      this.$store.state.address,
      this.asset.asset_contract.address,
      this.asset.token_id,
      this.takerAssetAmount
    )
  }

  async executeApprove() {
    this.openDialog(3)
    await this.$satellites.erc721Token.setApprovalForAllAsync(
      this.asset.asset_contract.address,
      this.$store.state.address,
      this.$store.state.address,
      this.$satellites.contractAddresses.erc721Proxy,
      true
    )
  }

  async executeBuy() {
    this.openDialog(4)
    await this.$satellites.buy(this.$store.state.address, this.asset.order)
  }

  async executeCancel() {
    this.openDialog(4)
    await this.$satellites.cancel(this.asset.order)
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
