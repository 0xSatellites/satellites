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
        v-if="asset.owner.address !== this.$store.state.address && asset.price"
        small
        round
        color="primary"
        @click.stop="openDialog(3)"
        >{{ this.$web3.utils.fromWei(asset.price) }} ETH<v-icon small right>add_shopping_cart</v-icon></v-btn
      >
      <v-btn
        v-if="asset.owner.address === this.$store.state.address && asset.price"
        small
        round
        color="primary"
        @click.stop="openDialog(4)"
        >Cancel<v-icon small right>money_off</v-icon></v-btn
      >
      <v-btn
        v-if="asset.owner.address === this.$store.state.address && !asset.price"
        small
        round
        color="primary"
        @click.stop="openDialog(2)"
        >Sell<v-icon small right>attach_money</v-icon></v-btn
      >
      <v-btn
        v-if="asset.owner.address === this.$store.state.address && !asset.price"
        small
        round
        color="primary"
        @click.stop="openDialog(1)"
        >Gift<v-icon small right>card_giftcard</v-icon></v-btn
      >
    </v-card-actions>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" max-width="500">
        <v-card class="pa-3">
          <div v-if="key == 1">
            <v-card-title class="headline">Input Receiver Address.</v-card-title>
            <v-card-text>
              <v-text-field label="address" placeholder="0x..."></v-text-field>
            </v-card-text>
          </div>
          <div v-if="key == 2">
            <v-card-title class="headline">Input Price.</v-card-title>
            <v-card-text>
              <v-text-field label="amount" placeholder="ETH"></v-text-field>
            </v-card-text>
          </div>
          <v-card-actions v-if="key == 1 || key == 2">
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="dialog = false">
              Cancel
            </v-btn>
            <v-btn color="primary" flat @click="dialog = false">
              Confirm
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Asset extends Vue {
  dialog = false
  key = 0
  @Prop() asset
  openDialog(key) {
    this.key = key
    this.dialog = true
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
