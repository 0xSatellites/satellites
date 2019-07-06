<template>
  <div class="container">
    <Assets :assets="assets"></Assets>
  </div>
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
    const owner = this.$route.params.address
    const assets = await this.$axios.get(
      `https://api.opensea.io/api/v1/assets?owner=${owner}`
    )
    console.log(assets.data.assets)
    this.assets = assets.data.assets
  }
}
</script>
