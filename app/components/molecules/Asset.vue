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
    this.dialogKey = 4
    const contract = this.$satellites.erc721(this.asset.asset_contract.address)
    contract.methods
      .transferFrom(this.$store.state.address, this.asset.asset_contract.address, this.asset.token_id)
      .send({ from: this.$store.state.address })
      .on('transactionHash', (hash) => {
        this.dialogKey = 5
        console.log(hash)
      })
  }
  async sell() {
    const contract = this.$satellites.erc721(this.asset.asset_contract.address)
    const isApprovedForAll = await contract.methods
      .isApprovedForAll(this.$store.state.address, this.$satellites.contractAddresses.erc721Proxy)
      .call()
    if (!isApprovedForAll) {
      await contract.methods
        .setApprovalForAll(this.$satellites.contractAddresses.erc721Proxy, true)
        .send({ from: this.$store.state.address })
    } else {
      this.dialogKey = 4
      this.order()
    }
  }
  async order() {
    await this.$satellites.sell(
      this.$store.state.address,
      this.asset.asset_contract.address,
      this.asset.token_id,
      this.takerAssetAmount
    )
  }
  async purchase() {
    await this.$satellites.buy(this.$store.state.address, this.asset.order)
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
