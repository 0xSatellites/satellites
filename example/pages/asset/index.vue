<template>
  <v-content>
    <v-container>
      <Detail v-if="asset" :asset="asset"></Detail>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Detail from '~/components/organisms/Detail.vue'

const networkToAssetMetadataAPIBase: { [networkId: number]: string } = {
  1: `https://api.opensea.io/api/v1/assets`,
  4: `https://rinkeby-api.opensea.io/api/v1/assets`
}

@Component({
  components: {
    Detail
  }
})
export default class Index extends Vue {
  asset = null
  apiBase = networkToAssetMetadataAPIBase[process.env.NETWORK_ID || 1]
  async mounted() {
    const tokenId = this.$route.query.id
    const assetContractAddress = this.$route.query.address
    const asset = await this.$satellites.getAssetData(assetContractAddress, tokenId)

    const order = await this.$satellites.getOrder(assetContractAddress, tokenId)
    asset.order = order
    this.asset = asset
  }
  async getAssetData(assetContractAddress: string, tokenId: number) {
    const asset = await this.$axios.get(
      `${this.apiBase}?token_ids=${tokenId}&asset_contract_address=${assetContractAddress}`
    )
    const assets = asset.data.assets
    return assets[0]
  }
}
</script>
