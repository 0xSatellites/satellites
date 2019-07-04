<template>
  <div class="container">
    <Orders></Orders>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Orders from '~/components/organisms/Orders.vue'

@Component({
  components: {
    Orders
  }
})
export default class Index extends Vue {}
</script>
