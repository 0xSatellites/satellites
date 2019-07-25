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

@Component({
  components: {
    Assets
  }
})
export default class Index extends Vue {
  assets = null
  async mounted() {
    let params
    if (this.$route.query.address) {
      params = [this.$route.query.address]
    }
    const refinedOrders = await this.$satellites.getOrders(params)
    const assets = await this.getAssetDataForOrders(refinedOrders)
    this.assets = assets
  }
  async getAssetDataForOrders(refinedOrders) {
    const assets: any = []
    const promisses: any = []
    for (const tokenAddress in refinedOrders) {
      let requestURL = `${this.$config.api}getAssetsByAssetAddressesTokenIds?asset_contract_addresses=${tokenAddress}`
      for (const tokenId in refinedOrders[tokenAddress]) {
        requestURL = `${requestURL}&token_ids=${tokenId}`
      }
      promisses.push(this.$axios.get(requestURL))
    }
    const resolves = await Promise.all(promisses)
    for (const resolve of resolves) {
      for (const asset of (resolve as any).data.assets) {
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
