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
    const assets = await this.$satellites.getAssetDataForOwner(this.$route.params.address)
    this.assets = assets
  }
}
</script>
