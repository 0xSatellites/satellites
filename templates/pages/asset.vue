<template>
  <v-content>
    <v-container>
      <Loading v-if="loading"></Loading>
      <Detail v-if="asset" :asset="asset"></Detail>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Detail from '~/components/organisms/Detail.vue'
import Loading from '~/components/organisms/Loading.vue'

@Component({
  components: {
    Detail,
    Loading
  }
})
export default class Index extends Vue {
  asset = null
  loading = true
  async mounted() {
    const tokenId = this.$route.query.id
    const assetContractAddress = this.$route.query.address
    const asset = await this.getAssetData(assetContractAddress, tokenId)
    const order = await this.$satellites.getOrder(assetContractAddress, tokenId)
    asset.order = order
    this.asset = asset
    this.loading = false
  }
  async getAssetData(assetContractAddress, tokenId) {
    const asset = await this.$axios.get(
      `${this.$config.api}assets?token_ids=${tokenId}&asset_contract_address=${assetContractAddress}`
    )
    const assets = asset.data.assets
    return assets[0]
  }
}
</script>
