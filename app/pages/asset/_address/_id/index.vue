<template>
  <v-content>
    <v-container>
      <Detail :assets="assets"></Detail>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { HttpClient } from '@0x/connect'
import { assetDataUtils, BigNumber } from '0x.js'
import Detail from '~/components/organisms/Detail.vue'
const httpClient = new HttpClient('http://35.200.51.207:3000/v2/')

@Component({
  components: {
    Detail
  }
})
export default class Index extends Vue {
  assets = []
  async mounted() {
    const tokenId = this.$route.params.id
    const assetContractAddress = this.$route.params.address
    const assetData = assetDataUtils.encodeERC721AssetData(assetContractAddress, new BigNumber(tokenId))
    const orderbookRequest = {
      baseAssetData: assetData,
      quoteAssetData: '0xf47261b00000000000000000000000000e5b093bfee5021110e1b672bb169ae77503658f'
    }
    const orderBooks = await httpClient.getOrderbookAsync(orderbookRequest, {
      networkId: 4
    })
    let order = null
    for (const record of orderBooks.asks.records) {
      if (!order) {
        order = record.order
      } else if (order.takerAssetAmount > record.order.takerAssetAmount) {
        order = record.order
      }
    }

    const asset = await this.$axios.get(
      `https://rinkeby-api.opensea.io/api/v1/assets?token_ids=${tokenId}&asset_contract_address=${assetContractAddress}`
    )
    const assets = asset.data.assets

    assets[0].order = order
    console.log(assets[0].order.takerAssetAmount)
    this.assets = assets
  }
}
</script>
