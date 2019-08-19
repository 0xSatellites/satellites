<template>
  <v-app class="white">
    <v-system-bar absolute app height="7px" color="primary"></v-system-bar>
    <Header></Header>
    <nuxt />
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
export default class DefaultLayout extends Vue {
  mounted() {
    console.log('️🛰️ Welcome　to satellites! 🛰️')
    /* eslint-disable */
    console.log("\n" +
      " ____                  __               ___       ___              __                       \n" +
      "/\\  _`\\               /\\ \\__           /\\_ \\     /\\_ \\      __    /\\ \\__                    \n" +
      "\\ \\,\\L\\_\\      __     \\ \\ ,_\\     __   \\//\\ \\    \\//\\ \\    /\\_\\   \\ \\ ,_\\     __     ____   \n" +
      " \\/_\\__ \\    /'__`\\    \\ \\ \\/   /'__`\\   \\ \\ \\     \\ \\ \\   \\/\\ \\   \\ \\ \\/   /'__`\\  /',__\\  \n" +
      "   /\\ \\L\\ \\ /\\ \\L\\.\\_   \\ \\ \\_ /\\  __/    \\_\\ \\_    \\_\\ \\_  \\ \\ \\   \\ \\ \\_ /\\  __/ /\\__, `\\ \n" +
      "   \\ `\\____\\\\ \\__/.\\_\\   \\ \\__\\\\ \\____\\   /\\____\\   /\\____\\  \\ \\_\\   \\ \\__\\\\ \\____\\\\/\\____/ \n" +
      "    \\/_____/ \\/__/\\/_/    \\/__/ \\/____/   \\/____/   \\/____/   \\/_/    \\/__/ \\/____/ \\/___/  \n"
    )
    /* eslint-enable */
  }
}
</script>

<style>
a {
  text-decoration: none;
}
</style>
