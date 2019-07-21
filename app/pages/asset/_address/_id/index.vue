<template>
  <v-content>
    <v-container>
      <Detail :assets="assets"></Detail>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Detail from '~/components/organisms/Detail.vue'

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
    const order = await this.$satellites.getOrder(assetContractAddress, tokenId)

    const asset = await this.$axios.get(
      `https://rinkeby-api.opensea.io/api/v1/assets?token_ids=${tokenId}&asset_contract_address=${assetContractAddress}`
    )
    const assets = asset.data.assets

    assets[0].order = order
    this.assets = assets
  }
}
</script>
