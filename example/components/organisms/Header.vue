<template>
  <v-toolbar absolute flat clipped-left app class="white">
    <nuxt-link :src="logoPc" tag="img" height="60%" to="/" class="hidden-sm-and-down"> </nuxt-link>
    <nuxt-link :src="logoSp" tag="img" height="60%" to="/" class="hidden-sm-and-up"> </nuxt-link>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn
        v-if="this.$store.state.address"
        flat
        color="primary"
        :to="'/account?address=' + this.$store.state.address"
      >
        MyPage
      </v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn flat color="primary" v-on="on">
            Market
          </v-btn>
        </template>
        <v-list v-for="token in this.$store.state.tokens" :key="token.contract">
          <v-list-tile>
            <v-btn flat color="primary" :to="'/'">Market</v-btn>
          </v-list-tile>
          <v-list-tile>
            <v-btn flat color="primary" :to="'/'">Market</v-btn>
          </v-list-tile>
          <v-list-tile>
            <v-btn flat color="primary" :to="'/'">Market</v-btn>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
const logoPc = require('~/assets/img/logo_pc.svg')
const logoSp = require('~/assets/img/logo_sp.svg')

@Component
export default class Header extends Vue {
  logoPc = logoPc
  logoSp = logoSp
  items = [{ index: 1, title: 'test' }, { index: 2, title: 'ok' }, { index: 3, title: 'tee' }]
}
</script>
