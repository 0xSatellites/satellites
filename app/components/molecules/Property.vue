<template>
  <v-card flat class="pa-2">
    <v-card-title><span class="title font-weight-light">Property</span></v-card-title>
    <v-chip v-for="trait in asset.traits" :key="trait.trait_type" disabled outline small>
      {{ trait.trait_type }} : {{ trait.value }}
    </v-chip>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Property extends Vue {
  @Prop() asset
}
</script>
