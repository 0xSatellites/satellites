<template>
  <v-app dark>

  <!--
    <v-navigation-drawer
      disable-resize-watcher
      v-model="drawer"
      fixed
      app
    >
      <v-list>
        <v-list-tile
          v-for="(item, i) in items"
          :to="item.to"
          :key="i"
          router
          exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon" />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    -->

    <v-toolbar
      fixed
      app
    >
      <!--
      <v-toolbar-side-icon @click="drawer = !drawer" />
      -->
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
          { icon: 'apps', title:"Hero", to: '/mycryptoheroes/onsale/hero' },
          { icon: 'bubble_chart', title:"Extension", to: '/mycryptoheroes/onsale/extension' },
          { icon: 'bubble_chart', title:"MyItems", to: '/mycryptoheroes/myitems' }
        ],
        title: 'bazaar.io'
      }
    }
  }
</script>
