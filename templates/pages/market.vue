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
import {
  DEFAULT_ASSETS_PER_PAGE,
  getOrderEntries,
  getPageItems,
  getPageOffset,
  getVisiblePageLength
} from '~/plugins/pagination'

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
    let params
    if (this.$route.query.address) {
      params = [this.$route.query.address]
    }
    const refinedOrders = await this.$satellites.getOrders(params)
    const orderEntries = getOrderEntries(refinedOrders)
    const pageOrderEntries = getPageItems(orderEntries, page, DEFAULT_ASSETS_PER_PAGE)
    const assets = await this.getAssetDataForOrders(pageOrderEntries)
    this.assets = assets
    this.pageLength = getVisiblePageLength(
      page,
      orderEntries.length > getPageOffset(page, DEFAULT_ASSETS_PER_PAGE) + DEFAULT_ASSETS_PER_PAGE
    )
    this.loading = false
  }
  async getAssetDataForOrders(orderEntries) {
    const assets: any = []
    const promisses: any = []
    for (const orderEntry of orderEntries) {
      const requestURL = `${this.$config.api}assets?asset_contract_addresses=${orderEntry.tokenAddress}&token_ids=${orderEntry.tokenId}`
      promisses.push(this.$axios.get(requestURL).then(resolve => ({ resolve, orderEntry })))
    }
    const resolves = await Promise.all(promisses)
    for (const { resolve, orderEntry } of resolves) {
      for (const asset of (resolve as any).data.assets) {
        asset.order = orderEntry.order
        assets.push(asset)
      }
    }
    return assets
  }
}
</script>
