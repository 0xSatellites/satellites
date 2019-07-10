<template>
  <v-layout row wrap>
    <v-flex xs8 offset-xs2 md4 offset-md4>
      <div>
        <v-img :src="asset.image_url" aspect-ratio="1"></v-img>
      </div>
    </v-flex>
    <v-flex xs10 offset-xs1>
      <v-card flat>
        <v-card-title class="justify-center">
          <span class="headline">{{ asset.name }}</span>
        </v-card-title>
        <v-card-title class="justify-center">
          <span class="grey--text">{{ asset.description }}</span>
        </v-card-title>
        <v-card-actions class="justify-center">
          <v-btn flat color="accent">Sell</v-btn>
          <v-btn flat color="accent">Gift</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Asset extends Vue {
  @Prop() asset
}
</script>
