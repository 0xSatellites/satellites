<template>
  <v-content>
    <v-container>
      <div v-for="asset in assets" :key="asset.id">
        <DetailedAsset :asset="asset"></DetailedAsset>
      </div>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { HttpClient } from '@0x/connect'
import { assetDataUtils, BigNumber } from '0x.js'
import DetailedAsset from '~/components/organisms/DetailedAsset.vue'
const httpClient = new HttpClient('http://35.200.51.207:3000/v2/')

@Component({
  components: {
    DetailedAsset
  }
})
export default class Index extends Vue {
  assets = []
  async mounted() {
    const tokenId = this.$route.params.id
    const assetContractAddress = this.$route.params.address
    const assetData = assetDataUtils.encodeERC721AssetData(
      assetContractAddress,
      new BigNumber(tokenId)
    )
    const orderbookRequest = {
      baseAssetData: assetData,
      quoteAssetData:
        '0xf47261b0000000000000000000000000c778417e063141139fce010982780140aa0cd5ab'
    }
    const orderBooks = await httpClient.getOrderbookAsync(orderbookRequest, {
      networkId: 4
    })
    let price = null
    for (const order of orderBooks.asks.records) {
      if (!price) {
        price = order.order.takerAssetAmount
      } else if (price > order.order.takerAssetAmount) {
        price = order.order.takerAssetAmount
      }
    }
    const asset = await this.$axios.get(
      `https://rinkeby-api.opensea.io/api/v1/assets?token_ids=${tokenId}&asset_contract_address=${assetContractAddress}`
    )
    const assets = asset.data.assets
    assets[0].price = price
    this.assets = assets
  }
}
</script>
