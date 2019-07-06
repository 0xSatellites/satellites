<template>
  <v-layout row wrap>
    <v-flex v-for="asset in assets" :key="asset.id" xs4>
      <SimpleAsset :asset="asset"></SimpleAsset>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import SimpleAsset from '~/components/molecules/SimpleAsset.vue'

@Component({
  components: {
    SimpleAsset
  }
})
export default class Assets extends Vue {
  @Prop() assets
}
</script>
