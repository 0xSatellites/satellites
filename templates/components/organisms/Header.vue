<template>
  <v-toolbar absolute flat clipped-left app class="white">
    <nuxt-link to="/"> Satellites </nuxt-link>
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

@Component
export default class Header extends Vue {}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
