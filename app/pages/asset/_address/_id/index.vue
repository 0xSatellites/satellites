<template>
  <div class="container">
    <div v-for="asset in assets" :key="asset.id">
      <DetailedAsset :asset="asset"></DetailedAsset>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DetailedAsset from '~/components/molecules/DetailedAsset.vue'

@Component({
  components: {
    DetailedAsset
  }
})
export default class Index extends Vue {
  assets = []
  async mounted() {
    const tokenIds = this.$route.params.id
    const assetContractAddress = this.$route.params.address
    const asset = await this.$axios.get(
      `https://api.opensea.io/api/v1/assets?token_ids=${tokenIds}&asset_contract_address=${assetContractAddress}`
    )
    console.log(asset.data.assets[0])
    this.assets = asset.data.assets
  }
}
</script>
