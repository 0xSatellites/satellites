<template>
  <v-layout>
    <v-layout row wrap v-for="(item,i) in heroes" :key="i">
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
        heroes: [{"name":"MCH Hero: #30040157 Lv.1","description":"HeroName: Mata Hari","image":"https://www.mycryptoheroes.net/images/heroes/2000/3004.png","attributes":{"active_skill":"Rest","agi":20,"hero_name":"Mata Hari","hp":45,"id":30040157,"int":19,"lv":1,"passive_skill":"Eye of the day","phy":14,"rarity":"Rare"},"external_url":"https://www.mycryptoheroes.net/heroes/30040157","image_url":"https://www.mycryptoheroes.net/images/heroes/2000/3004.png","home_url":"https://www.mycryptoheroes.net"}],
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