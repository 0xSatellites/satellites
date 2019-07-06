<template>
  <div>
    <v-card>
      <v-img :src="asset.image_url"></v-img>
      <v-card-title>
        <div>
          <span>{{ asset.name }}</span>
        </div>
      </v-card-title>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Asset extends Vue {
  @Prop() asset
}
</script>
