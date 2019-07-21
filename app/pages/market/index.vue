<template>
  <v-content>
    <v-container>
      <Assets :assets="assets"></Assets>
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
  assets = []
  async mounted() {
    const refinedOrders = await this.$satellites.getOrders()
    const metadataPromises = []
    for (const tokenAddress in refinedOrders) {
      let requestURL = `https://rinkeby-api.opensea.io/api/v1/assets?asset_contract_address=${tokenAddress}`
      for (const tokenId in refinedOrders[tokenAddress]) {
        requestURL = requestURL + `&token_ids=${tokenId}`
      }
      metadataPromises.push(this.$axios.get(requestURL))
    }
    const metadataResolved = await Promise.all(metadataPromises)
    const assets = []
    for (const metadataPerAsset of metadataResolved) {
      for (const metadata of metadataPerAsset.data.assets) {
        const asset = metadata
        if (refinedOrders[metadata.asset_contract.address][metadata.token_id]) {
          asset.order = refinedOrders[metadata.asset_contract.address][metadata.token_id]
        }
        assets.push(asset)
      }
    }
    this.assets = assets
  }
}
</script>
