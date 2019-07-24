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

@Component({
  components: {
    Assets
  }
})
export default class Index extends Vue {
  assets = null
  apiBase = networkToAssetMetadataAPIBase[process.env.NETWORK_ID || 1]
  async mounted() {
    const refinedOrders = await this.$satellites.getOrders()
    const assets = await this.getAssetDataForOrders(refinedOrders)
    this.assets = assets
  }
  async getAssetDataForOrders(refinedOrders) {
    const assets: any = []
    for (const tokenAddress in refinedOrders) {
      let requestURL = `${this.apiBase}?limit=300&asset_contract_address=${tokenAddress}`
      for (const tokenId in refinedOrders[tokenAddress]) {
        requestURL = `${requestURL}&token_ids=${tokenId}`
      }
      const response = await this.$axios.get(requestURL)
      for (const asset of response.data.assets) {
        if (refinedOrders[asset.asset_contract.address][asset.token_id]) {
          asset.order = refinedOrders[asset.asset_contract.address][asset.token_id]
        }
        assets.push(asset)
      }
    }
    return assets
  }
}
</script>
