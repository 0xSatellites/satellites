<template>
  <v-content>
    <v-container>
      <Game :url="this.$route.query.url" :relatedAssets="relatedAssets"></Game>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { HttpClient } from '@0x/connect'
import { assetDataUtils } from '0x.js'
import Game from '~/components/organisms/Game.vue'
const httpClient = new HttpClient('http://35.200.51.207:3000/v2/')

@Component({
  components: {
    Game
  }
})
export default class Index extends Vue {
  relatedAssets = []
  async mounted() {
    const rawOrders = await httpClient.getOrdersAsync({ networkId: 4 })
    const refinedOrders = {}
    for (const order of rawOrders.records) {
      const assetData = assetDataUtils.decodeERC721AssetData(order.order.makerAssetData)
      if (!refinedOrders[assetData.tokenAddress]) {
        refinedOrders[assetData.tokenAddress] = {}
      }
      if (
        !refinedOrders[assetData.tokenAddress][assetData.tokenId] ||
        refinedOrders[assetData.tokenAddress][assetData.tokenId] > order.order.takerAssetAmount
      ) {
        refinedOrders[assetData.tokenAddress][assetData.tokenId] = order.order.takerAssetAmount
      }
    }
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
