<template>
  <v-footer class="white">
    <v-flex text-xs-center style="color: gray;">
      &copy;2019 <a href="https://block-base.co/">BlockBase,Inc.</a>&nbsp;|&nbsp;
      <nuxt-link to="/terms">Terms</nuxt-link>
    </v-flex>
  </v-footer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class Footer extends Vue {}
</script>

<style scoped>
a {
  text-decoration: none;
  color: gray;
}
</style>
