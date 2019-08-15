<template>
  <v-card v-if="asset" flat>
    <nuxt-link
      :to="{
        name: 'asset',
        query: {
          address: asset.asset_contract.address,
          id: asset.token_id
        }
      }"
    >
      <v-img :src="asset.image_url" aspect-ratio="1"
        ><v-btn v-if="asset.order" color="secondary" class="opacity" small
          ><v-icon small left>label</v-icon>{{ computePrice(asset.order.takerAssetAmount) }} ETH</v-btn
        >
        <!--
        <a :href="`https://opensea.io/assets/${asset.asset_contract.address}/${asset.token_id}`"
          ><v-img id="opensea" class="pa-2" :src="opensea"></v-img
        ></a>
        -->
      </v-img>
      <v-card-title class="justify-center">
        <span class="grey--text">{{ asset.name }}</span>
      </v-card-title>
    </nuxt-link>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
//  const opensea = require('~/assets/img/opensea-logomark-flat-colored-blue.png')

@Component
export default class Asset extends Vue {
  @Prop() asset
  //  opensea = opensea
  computePrice(price) {
    const feeRatio = this.$config.defaultRatio / this.$config.feeBase
    const fee = price.times(feeRatio)
    const amount = price.plus(fee)
    return this.$web3.utils.fromWei(amount.toString())
  }
}
</script>

<style scoped>
.opacity {
  opacity: 0.6;
}

/*
#opensea {
  position: absolute;
  bottom: 1%;
  right: 1%;
}
*/
</style>
