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
    const assets = await this.$satellites.getAssetDataForOwner(this.$route.query.address)
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
}
</script>
