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
    if (this.$config.whitelists) {
      const base = '&asset_contract_addresses='
      for (const assetContractAddress of this.$config.whitelists) {
        assetContractAddressesQuery = assetContractAddressesQuery + base + assetContractAddress
      }
    }
    const assets = await this.$axios.get(
      `${this.$config.opensea}?limit=300&order_by=token_id&owner=${owner}${assetContractAddressesQuery}`
    )
    return assets.data.assets
  }
}
</script>
