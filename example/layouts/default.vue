<template>
  <v-app class="white">
    <v-system-bar absolute app height="7px" color="primary"></v-system-bar>
    <Header></Header>
    <nuxt />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Header from '~/components/organisms/Header.vue'

@Component({
  components: {
    Header
  }
})
export default class DefaultLayout extends Vue {}
</script>
