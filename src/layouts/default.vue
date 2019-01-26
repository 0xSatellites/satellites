<template>
  <div>
    <div v-for="(item, i) in items" :key="i"><nuxt-link :to="item.to">{{item.title}}</nuxt-link></div>
    <nuxt />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        drawer: false,
        items: [
          { icon: 'bubble_chart', title:"MyItems", to: '/myitems' }
        ],
        title: 'bazaar.io'
      }
    }
  }
</script>
