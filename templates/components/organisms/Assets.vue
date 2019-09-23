<template>
  <v-layout row wrap>
    <paginate name="assets" :list="assets">
      <v-flex v-for="asset in paginated('assets')" :key="asset.id" xs6 md2>
        <Asset :asset="asset" class="pa-3"></Asset>
      </v-flex>
    </paginate>
    <paginate-links for="assets" :show-step-links="true" class="list-style-none"></paginate-links>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Asset from '~/components/molecules/Asset.vue'

@Component({
  components: {
    Asset
  }
})
export default class Assets extends Vue {
  @Prop() assets
  @Prop() paginate = ['assets']
}
</script>

<style>
.list-style-none {
  list-style-type: none;
}
</style>
