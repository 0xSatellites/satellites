<template>
  <v-card v-if="asset" flat>
    <nuxt-link
      :to="{
        name: 'asset-address-id',
        params: {
          address: asset.asset_contract.address,
          id: asset.token_id
        }
      }"
    >
      <v-img :src="asset.image_url" aspect-ratio="1"> </v-img>
      <v-card-title class="justify-center">
        <span class="grey--text">{{ asset.name }}</span>
      </v-card-title>
    </nuxt-link>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Asset extends Vue {
  @Prop() asset
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
