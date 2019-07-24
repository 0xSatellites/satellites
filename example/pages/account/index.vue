<template>
  <v-content>
    <v-container>
      <Assets v-if="assets" :assets="assets"></Assets>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Assets from '~/components/organisms/Assets.vue'

const networkToAssetMetadataAPIBase: { [networkId: number]: string } = {
  1: `https://api.opensea.io/api/v1/assets`,
  4: `https://rinkeby-api.opensea.io/api/v1/assets`
}

const tokens: { [networkId: number]: string[] } = {
  1: [
    '0x06012c8cf97bead5deae237070f9587f8e7a266d',
    '0x1a94fce7ef36bc90959e206ba569a12afbc91ca1',
    '0x273f7f8e6489682df756151f5525576e322d51a3',
    '0xdceaf1652a131f32a821468dc03a92df0edd86ea',
    '0xfac7bea255a6990f749363002136af6556b31e04',
    '0x79986af15539de2db9a5086382daeda917a9cf0c'
  ],
  4: [
    '0xc106d47fb4bf5f9ebaf46e3219ef3fabcbd26606',
    '0x5220debd5a575d1bf85b5531c9e0f6ced243975c',
    '0x16baf0de678e52367adc69fd067e5edd1d33e3bf',
    '0x587ae915d4ccaa5c2220c638069f2605e1f7404c'
  ]
}

@Component({
  components: {
    Assets
  }
})
export default class Index extends Vue {
  assets = null
  apiBase = networkToAssetMetadataAPIBase[process.env.NETWORK_ID || 1]
  whitelists = tokens[process.env.NETWORK_ID || 1]
  async mounted() {
    const assets = await this.getAssetDataForOwner(this.$route.query.address as string)
    const refinedOrders = await this.$satellites.getOrders()
    for (const asset of assets) {
      if (refinedOrders[asset.asset_contract.address]) {
        if (refinedOrders[asset.asset_contract.address][asset.token_id]) {
          asset.order = refinedOrders[asset.asset_contract.address][asset.token_id]
        }
      }
    }
    this.assets = assets
  }
  async getAssetDataForOwner(owner: string) {
    let assetContractAddressesQuery = ''
    if (this.whitelists) {
      const base = '&asset_contract_addresses='
      for (const assetContractAddress of this.whitelists) {
        assetContractAddressesQuery = assetContractAddressesQuery + base + assetContractAddress
      }
    }
    const assets = await this.$axios.get(
      `${this.apiBase}?limit=300&order_by=token_id&owner=${owner}${assetContractAddressesQuery}`
    )
    return assets.data.assets
  }
}
</script>
