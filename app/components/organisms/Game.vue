<template>
  <v-layout row wrap>
    <v-flex xs12 md6>
      <v-card height="100%" flat class="pa-2">
        <iframe width="100%" height="90%" :src="url"></iframe>
        <v-card-action>
          <a :href="url">
            <v-btn block color="primary">Original Page</v-btn>
          </a>
        </v-card-action>
      </v-card>
    </v-flex>
    <v-flex xs12 md1></v-flex>
    <v-flex xs12 md5>
      <v-card flat class="pa-2">
        <v-card-title><span class="title font-weight-light">Advertisement</span></v-card-title>
        <img src="https://adnico.co.jp/images/banner320_100.png" />
      </v-card>
      <v-card flat class="pa-2">
        <v-card-title><span class="title font-weight-light">Related Assets</span></v-card-title>
        <v-layout row wrap>
          <v-flex v-for="relatedAsset in relatedAssets" :key="relatedAsset.id" xs4>
            <Asset :asset="relatedAsset"></Asset>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
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
export default class Game extends Vue {
  @Prop() relatedAssets
  @Prop() url
}
</script>
