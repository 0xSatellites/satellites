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
      <div class="pa-3">
        <v-img :src="asset.image_url" aspect-ratio="1"></v-img>
      </div>
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
