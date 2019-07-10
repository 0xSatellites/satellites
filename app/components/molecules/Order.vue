<template>
  <v-card flat>
    <nuxt-link
      :to="{
        name: 'asset-address-id',
        params: {
          address: order.asset_contract.address,
          id: order.token_id
        }
      }"
    >
      <div class="pa-3">
        <v-img :src="order.image_url" aspect-ratio="1">10ETH</v-img>
      </div>
    </nuxt-link>
    <v-fade-transition>
      <v-overlay v-if="hover" absolute color="#036358">
        <v-btn>See more info</v-btn>
      </v-overlay>
    </v-fade-transition>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Asset extends Vue {
  @Prop() order
}
</script>
