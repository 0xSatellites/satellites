<template>
  <v-layout>
    <v-layout row wrap>
      <v-flex xs4 md2 v-for="(item,i) in items" :key="i">
          <v-card class="rounded-card ma-2">

            <v-card-title primary-title>
              <div>
                <div class="headline">{{item.attributes.rarity}}</div>
                <span class="grey--text">Lv. {{item.attributes.lv}}</span>
              </div>
            </v-card-title>
            <v-card-text><img v-bind:src="item.image" width="100%" alt=""></v-card-text>
            <v-card-text>{{item.attributes.hero_name}}</v-card-text>
          </v-card>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>

  import axios from 'axios'

  export default {
    data() {
      return {
        items: [],
      }
    },

    mounted: async function() {
      console.log("tet")
      const response = await axios.get('http://localhost:3001/hero/ownedTokens?address=0xB1A25D6E37ad12579801eBb6787636fd63ba87cc');
      this.items = response.data   
    }
  }

</script>
