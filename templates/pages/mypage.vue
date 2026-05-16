<template>
  <v-content>
    <v-container>
      <Loading v-if="loading"></Loading>
      <Assets v-if="assets" :assets="assets"></Assets>
      <v-pagination
        v-if="pageLength > 1"
        v-model="page"
        :length="pageLength"
        @input="loadPage"
      ></v-pagination>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Assets from '~/components/organisms/Assets.vue'
import Loading from '~/components/organisms/Loading.vue'
import { DEFAULT_ASSETS_PER_PAGE, buildAssetPageUrl, getVisiblePageLength } from '~/plugins/pagination'

@Component({
  components: {
    Assets,
    Loading
  }
})
export default class Index extends Vue {
  assets = null
  loading = true
  page = 1
  pageLength = 1
  async mounted() {
    await this.loadPage(1)
  }
  async loadPage(page = 1) {
    this.page = page
    this.loading = true
    const assets = await this.getAssetDataForOwner(this.$store.state.address as string, page)
    const refinedOrders = await this.$satellites.getOrders()
    for (const asset of assets) {
      if (refinedOrders[asset.asset_contract.address]) {
        if (refinedOrders[asset.asset_contract.address][asset.token_id]) {
          asset.order = refinedOrders[asset.asset_contract.address][asset.token_id]
        }
      }
    }
    this.assets = assets
    this.pageLength = getVisiblePageLength(page, assets.length === DEFAULT_ASSETS_PER_PAGE)
    this.loading = false
  }
  async getAssetDataForOwner(owner: string, page: number) {
    const params = [`owner=${owner}`]
    if (this.$config.whitelists) {
      for (const assetContractAddress of this.$config.whitelists) {
        params.push(`asset_contract_addresses=${assetContractAddress}`)
      }
    }
    const requestURL = buildAssetPageUrl(`${this.$config.api}assets?${params.join('&')}`, page, DEFAULT_ASSETS_PER_PAGE)
    const assets = await this.$axios.get(requestURL)
    return assets.data.assets
  }
}
</script>
