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
    let addresses
    if (!this.isEmpty(this.$route.query)) {
      addresses = [Object.keys(this.$route.query)[0]]
    }
    const refinedOrders = await this.$satellites.getOrders(addresses)
    const assets = await this.getAssetDataForOrders(refinedOrders)
    this.assets = assets
  }
  async getAssetDataForOrders(refinedOrders) {
    const assets: any = []
    for (const tokenAddress in refinedOrders) {
      let requestURL = `${this.$config.opensea}?limit=300&asset_contract_address=${tokenAddress}`
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
  isEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) return false
    }
    return true
  }
}
</script>
