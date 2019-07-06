<template>
  <v-app class="white">
    <v-system-bar absolute app height="7px" color="primary"></v-system-bar>
    <Header></Header>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <Footer></Footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Header from '~/components/organisms/Header.vue'
import Footer from '~/components/organisms/Footer.vue'

@Component({
  components: {
    Header,
    Footer
  }
})
export default class DefaultLayout extends Vue {}
</script>
