<template>
  <v-content>
    <v-container>
      <Assets :assets="assets"></Assets>
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
  assets = []
  async mounted() {
    const assetContractAddresses = this.getAssetContractAddresses()
    const assetContractAddressesQuery = this.getAssetContractAddressesQuery(
      assetContractAddresses
    )
    const owner = this.$route.params.address
    const assets = await this.$axios.get(
      `https://rinkeby-api.opensea.io/api/v1/assets?order_by=token_id&owner=${owner}${assetContractAddressesQuery}`
    )
    this.assets = assets.data.assets
  }
  getAssetContractAddresses() {
    return [
      '0xc106d47fb4bf5f9ebaf46e3219ef3fabcbd26606'
      /*
      /* mainnet addresses
      '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d',
      '0x1a94fce7ef36Bc90959E206bA569a12AFBC91ca1',
      '0x273f7F8E6489682Df756151F5525576E322d51A3',
      '0xdceaf1652a131F32a821468Dc03A92df0edd86Ea'
      */
    ]
  }
  getAssetContractAddressesQuery(assetContractAddresses) {
    const base = '&asset_contract_addresses='
    let assetContractAddressesQuery = ''
    for (const assetContractAddress of assetContractAddresses) {
      assetContractAddressesQuery =
        assetContractAddressesQuery + base + assetContractAddress
    }
    return assetContractAddressesQuery
  }
}
</script>
