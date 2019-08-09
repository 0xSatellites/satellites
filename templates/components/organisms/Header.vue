<template>
  <v-toolbar absolute flat clipped-left app class="white">
    <nuxt-link :src="logoPc" tag="img" height="60%" to="/" class="hidden-sm-and-down"> </nuxt-link>
    <nuxt-link :src="logoSp" tag="img" height="60%" to="/" class="hidden-sm-and-up"> </nuxt-link>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn v-if="this.$store.state.address" flat color="primary" to="/mypage">
        MyPage
      </v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn flat color="primary" v-on="on">
            Market
          </v-btn>
        </template>
        <v-list>
          <v-list-tile>
            <a href="/market">
              <v-btn flat color="primary">
                All Assets
              </v-btn>
            </a>
          </v-list-tile>
          <v-list-tile v-for="token in this.$config.tokens" :key="token.contract">
            <a :href="`/market?address=${token.contract}`"
              ><v-btn flat color="primary">{{ token.name }}</v-btn></a
            >
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
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
