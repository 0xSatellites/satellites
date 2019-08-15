<template>
  <v-footer class="white">
    <v-flex text-xs-center style="color: gray;">
      &copy;2019 <a href="https://github.com/block-base/satellites">Powerd by Satellites</a>
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
