<template>
  <v-card flat>
    <nuxt-link
      :to="{
        name: 'asset-address-id',
        params: {
          address: asset.asset_contract.address,
          id: asset.token_id
        }
      }"
    >
      <v-img :src="asset.image_url" aspect-ratio="1"></v-img>
    </nuxt-link>
    <v-card-title class="justify-center">
      <span class="grey--text">{{ asset.name }}</span>
    </v-card-title>
    <v-card-actions class="justify-center">
      <v-btn
        v-if="asset.owner.address !== this.$store.state.address && asset.price"
        flat
        color="accent"
        >Purchase</v-btn
      >
      <v-btn
        v-if="asset.owner.address === this.$store.state.address && asset.price"
        flat
        color="accent"
        >Cancel</v-btn
      >
      <v-btn
        v-if="asset.owner.address === this.$store.state.address && !asset.price"
        flat
        color="accent"
        >Sell</v-btn
      >
      <v-btn
        v-if="asset.owner.address === this.$store.state.address && !asset.price"
        flat
        color="accent"
        >Gift</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Asset extends Vue {
  @Prop() asset
  mounted() {
    console.log(this.asset)
  }
}
</script>
