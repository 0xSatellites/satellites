<template>
  <div>
    <div v-for="(item, i) in items" :key="i"><nuxt-link :to="item.to">{{item.title}}</nuxt-link></div>
    <nuxt />
  </div>
</template>
<script>

  import client from '~/plugins/ethereum-client'
  import db from '~/plugins/db'

  export default {
    data() {
      return {
        drawer: false,
        items: [
          { title:"Home", to: '/' },
          { title:"MyItems", to: '/myitems' }
        ],
        title: 'bazaar.io'
      }
    },
    mounted: async function() {

    },

  }
</script>
<style>
</style>
