<template>
  <div class="container">
    <Home></Home>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Home from '~/components/templates/Home.vue'

@Component({
  components: {
    Home
  }
})
export default class Index extends Vue {
  public static layout = 'home'
}
</script>
