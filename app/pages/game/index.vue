<template>
  <v-content>
    <v-container>
      <Game :url="this.$route.query.url" :relatedAssets="relatedAssets"></Game>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Game from '~/components/organisms/Game.vue'

@Component({
  components: {
    Game
  }
})
export default class Index extends Vue {
  relatedAssets = []
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
    const relatedAssets = []
    let index = 0
    for (const metadataPerAsset of metadataResolved) {
      for (const metadata of metadataPerAsset.data.assets) {
        const asset = metadata
        if (refinedOrders[metadata.asset_contract.address][metadata.token_id]) {
          asset.price = refinedOrders[metadata.asset_contract.address][metadata.token_id].toString()
        }
        if (index < 3) {
          relatedAssets.push(asset)
          index++
        }
      }
    }
    this.relatedAssets = relatedAssets
    console.log(this.relatedAssets)
  }
}
</script>
