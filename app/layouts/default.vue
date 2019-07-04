<template>
  <v-app>
    <Navigation></Navigation>
    <Toolbar :drawer="drawer"></Toolbar>
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
import Navigation from '~/components/organisms/Navigation.vue'
import Toolbar from '~/components/organisms/Toolbar.vue'
import Footer from '~/components/organisms/Footer.vue'

@Component({
  components: {
    Footer,
    Toolbar,
    Navigation
  }
})
export default class Default extends Vue {
  drawer: boolean = false
}
</script>
