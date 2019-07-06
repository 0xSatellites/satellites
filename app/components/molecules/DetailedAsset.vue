<template>
  <v-card flat>
    <v-img :src="asset.image_url"></v-img>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Asset extends Vue {
  @Prop() asset
}
</script>
