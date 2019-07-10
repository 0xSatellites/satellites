<template>
  <v-layout row wrap>
    <v-flex v-for="order in orders" :key="order.id" xs4 md2>
      <Order :order="order"></Order>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Order from '~/components/molecules/Order.vue'

@Component({
  components: {
    Order
  }
})
export default class Orders extends Vue {
  @Prop() orders
}
</script>
