<template>
  <v-toolbar absolute flat clipped-left app class="white">
    <nuxt-link :src="logoPc" tag="img" height="60%" to="/" class="hidden-sm-and-down"> </nuxt-link>
    <nuxt-link :src="logoSp" tag="img" height="60%" to="/" class="hidden-sm-and-up"> </nuxt-link>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn v-if="this.$store.state.address" flat color="primary" :to="'/account/' + this.$store.state.address">
        MyPage
      </v-btn>
      <v-btn flat color="primary" :to="'/market'">Market</v-btn>
      <v-btn flat color="primary" :to="'/game?url=https%3A%2F%2Fmchdungeon.com%2Fgame'">Game</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import logoPc from '~/assets/img/logo_pc.svg'
import logoSp from '~/assets/img/logo_sp.svg'

@Component
export default class Header extends Vue {
  logoPc = logoPc
  logoSp = logoSp
}
</script>
