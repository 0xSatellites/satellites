<template>
  <Orders :orders="orders"></Orders>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Orders from '~/components/organisms/Orders.vue'

@Component({
  components: {
    Orders
  }
})
export default class Index extends Vue {
  orders = []
  async mounted() {
    const assetContractAddresses = this.getAssetContractAddresses()
    const assetContractAddressesQuery = this.getAssetContractAddressesQuery(
      assetContractAddresses
    )
    const owner = '0xbe21a1ccc576f2978f33227d302e3123843112f0'
    const orders = await this.$axios.get(
      `https://api.opensea.io/api/v1/assets?order_by=token_id&owner=${owner}${assetContractAddressesQuery}`
    )
    this.orders = orders.data.assets
  }
  getAssetContractAddresses() {
    return [
      '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d',
      '0x1a94fce7ef36Bc90959E206bA569a12AFBC91ca1',
      '0x273f7F8E6489682Df756151F5525576E322d51A3',
      '0xdceaf1652a131F32a821468Dc03A92df0edd86Ea'
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
