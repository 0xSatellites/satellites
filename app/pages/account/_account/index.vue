<template>
  <div class="container">
    <Assets></Assets>
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
  async mounted() {
    const account = this.$route.params.account
    const assets = await this.$axios.get(
      `https://api.opensea.io/api/v1/assets?owner=${account}`
    )
    console.log(assets)
  }
}
</script>
