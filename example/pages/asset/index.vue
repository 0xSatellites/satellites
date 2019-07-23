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

@Component({
  components: {
    Detail
  }
})
export default class Index extends Vue {
  asset = null
  async mounted() {
    console.log(this.$route)
    const tokenId = this.$route.params.id
    const assetContractAddress = this.$route.params.address
    const asset = await this.$satellites.getAssetData(assetContractAddress, tokenId)
    const order = await this.$satellites.getOrder(assetContractAddress, tokenId)
    asset.order = order
    this.asset = asset
  }
}
</script>
