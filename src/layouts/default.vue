<template>
  <div>
    <header class="l-header">
      <div class="l-header__logo"><img src="img/header/logo_pc.svg" alt="bazaaar.io" class="u-obj--pc"><img src="img/header/logo_sp.svg" alt="" class="u-obj--sp"></div>
      <nav class="l-header__nav">
      <ul>
      <li><a href="#">マイページ</a></li>
      <li><a href="#">使い方</a></li>
      </ul>
      </nav>
    </header>
    <!-- <div v-for="(item, i) in items" :key="i"><nuxt-link :to="item.to">{{item.title}}</nuxt-link></div> -->
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
<style scoped>

</style>
