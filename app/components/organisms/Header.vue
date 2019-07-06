<template>
  <v-toolbar absolute flat clipped-left app class="white">
    <img
      src="~/assets/img/logo_pc.svg"
      height="60%"
      class="hidden-sm-and-down"
    />
    <img src="~/assets/img/logo_sp.svg" height="60%" class="hidden-sm-and-up" />
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn flat color="primary">MyPage</v-btn>
      <v-btn flat color="primary">Market</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Header extends Vue {}
</script>
