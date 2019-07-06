<template>
  <div>
    <v-card>
      <nuxt-link
        :to="{
          name: 'asset-address-id',
          params: {
            address: asset.asset_contract.address,
            id: asset.token_id
          }
        }"
      >
        <v-img :src="asset.image_url"></v-img>
      </nuxt-link>
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
