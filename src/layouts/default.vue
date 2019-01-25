<template>
  <v-app dark>
    <v-toolbar
      fixed
      app
    >
      <img src="~/assets/img/bazaaar/icon.png" height="40%">
      <v-toolbar-title v-text="title" class="hidden-sm-and-down"/>
      <v-spacer></v-spacer>
    <v-toolbar-items
      v-for="(item, i) in items"
      :key="i"
    >
      <v-btn flat :to="item.to">{{item.title}}</v-btn>
    </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer
    >
      <v-layout
        justify-center
      >
        <span>{{title}} &copy; 2017</span>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data() {
      return {
        drawer: false,
        items: [
          { icon: 'bubble_chart', title:"MyItems", to: '/mycryptoheroes/myitems' }
        ],
        title: 'bazaar.io'
      }
    }
  }
</script>
