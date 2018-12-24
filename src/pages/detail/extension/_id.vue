<template>
  <v-layout>
    <v-layout row wrap v-for="(item,i) in extensions" :key="i">
      <v-flex xs12 md6>
          <div class="ma-5 pa-3">
            <v-card-text><img v-bind:src="item.image" width="100%" alt=""></v-card-text>
          </div>
      </v-flex>
      <v-flex xs12 md6>
        <v-card class="ma-5 pa-3">
          <v-card-title primary-title>
            <div>
              <div class="headline">{{item.attributes.hero_name}}</div>
              <span class="grey--text">{{item.name}}</span>
            </div>
          </v-card-title>
          <v-card-text>

            <v-layout row wrap>
              <v-flex xs3>HP: {{item.attributes.hp}}</v-flex>
              <v-flex xs3>PHY: {{item.attributes.phy}}</v-flex>
              <v-flex xs3>INT: {{item.attributes.int}}</v-flex>
              <v-flex xs3>AGI: {{item.attributes.agi}}</v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12>Passive Skill: {{item.attributes.passive_skill}}</v-flex>
              <v-flex xs12>Active Skill: {{item.attributes.active_skill}}</v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12>Price: 0.002 ETH</v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12>Price: 0.002 ETH</v-flex>
            </v-layout>
          </v-card-text>

          <v-card-actions>
            <v-btn dark @click="purchase">
              <v-icon dark>shopping_cart</v-icon>
              BUY NOW
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>


    </v-layout>
  </v-layout>
</template>

<script>

  import axios from 'axios'
  import contract from '~/assets/js/contract';
  import api from '~/assets/js/api';

  export default {
    data() {
      return {
        extensions: [{"name":"MCH Extension: #30020200 Lv.68","description":"ExtensionName: Brave Musket\nNickname: Brave Musket","image":"https://www.mycryptoheroes.net/images/extensions/2000/3002.png","attributes":{"active_skill":"Brave Shots","agi":26,"extension_name":"Brave Musket","hp":3,"int":77,"lv":68,"phy":1,"rarity":"Rare"},"external_url":"https://www.mycryptoheroes.net/extensions/30020200","image_url":"https://www.mycryptoheroes.net/images/extensions/2000/3002.png","home_url":"https://www.mycryptoheroes.net"}]
      }
    },

    mounted() {
      contract.hero.setProvider(web3.currentProvider)      
    },

    methods: {
      async purchase() {
        //console.log(contract)
        api.hero.bazaar()
      }
    }


/*
    mounted: async function() {
      const response = await axios.get('http://localhost:3001/hero/token?id=' + this.$route.params.id);
      this.item = response.data
    }

*/
  }
</script>