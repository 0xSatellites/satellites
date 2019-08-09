<template>
  <v-layout row wrap>
    <v-flex :key="asset.token_id" xs12 md4 offset-md4>
      <Asset class="pa-2" :asset="asset"></Asset>
      <Buttons :asset="asset"></Buttons>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Asset from '~/components/molecules/Asset.vue'
import Buttons from '~/components/molecules/Buttons.vue'

@Component({
  components: {
    Asset,
    Buttons
  }
})
export default class Assets extends Vue {
  @Prop() asset
}
</script>
