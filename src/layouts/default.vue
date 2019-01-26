<template>
  <div>
    <div v-for="(item, i) in items" :key="i"><nuxt-link :to="item.to">{{item.title}}</nuxt-link></div>
    <nuxt />
  </div>
</template>
<script>

  import client from '~/plugins/ethereum-client'

  export default {
    data() {
      return {
        drawer: false,
        items: [
          { title:"MyItems", to: '/myitems' }
        ],
        title: 'bazaar.io'
      }
    },
    mounted: async function() {
      const store = this.$store
      if(typeof web3 != 'undefined'){
        const account = await client.activate(web3.currentProvider)
        store.dispatch('account/setAccount', account)
        client.ownedTokens('mchh').then(function(val){
          store.dispatch('myitems/setMchh', val)
        })
      } else {

      }
    },

  }
</script>
<style>
</style>
