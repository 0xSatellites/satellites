<template>
  <v-layout> 
    <v-layout row wrap>
      <v-flex xs12 lg6>
          <div class="mx-5 my-2 pa-3">
            <v-card-text><img v-bind:src="hero.image" width="100%" alt=""></v-card-text>
          </div>
      </v-flex>
      <v-flex xs12 lg6>
        <v-card class="mx-1 my-4 pa-1">
          <v-card-title primary-title>
            <div>
              <div class="headline">{{hero.attributes.hero_name}}</div>
              <div class="grey--text">{{hero.name}}</div>
              <div><a class="caption" :href="hero.external_url"> {{hero.external_url}}</a></div>           
            </div>
          </v-card-title>
          <v-card-text>

            <v-layout row wrap>
              <v-flex xs3>HP :<span class="title font-weight-light"> {{hero.attributes.hp}}</span></v-flex>
              <v-flex xs3>PHY :<span class="title font-weight-light"> {{hero.attributes.phy}}</span></v-flex>
              <v-flex xs3>INT :<span class="title font-weight-light"> {{hero.attributes.int}}</span></v-flex>
              <v-flex xs3>AGI :<span class="title font-weight-light"> {{hero.attributes.agi}}</span></v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12><v-chip>Passive : {{hero.attributes.passive_skill}}</v-chip></v-flex>
              <v-flex xs12><v-chip>Active : {{hero.attributes.active_skill}}</v-chip></v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12>Price : <span class="headline font-weight-light">0.002 ETH</span></v-flex>
            </v-layout>
          </v-card-text>

          <v-card-actions>
            <v-btn dark large @click="purchase">
              Buy Now
              <v-icon right>shopping_cart</v-icon>
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

  export default {
    data() {
      return {
        //This is sample data for testing
        //heroes: [{"name":"MCH Hero: #30040157 Lv.1","description":"HeroName: Mata Hari","image":"https://www.mycryptoheroes.net/images/heroes/2000/3004.png","attributes":{"active_skill":"Rest","agi":20,"hero_name":"Mata Hari","hp":45,"id":30040157,"int":19,"lv":1,"passive_skill":"Eye of the day","phy":14,"rarity":"Rare"},"external_url":"https://www.mycryptoheroes.net/heroes/30040157","image_url":"https://www.mycryptoheroes.net/images/heroes/2000/3004.png","home_url":"https://www.mycryptoheroes.net"}],
      }
    },

    async asyncData({ store, params }) {
      await store.dispatch('hero/detail', params.id)
    },

    async mounted() {
      var self = this
      if(typeof web3 !== 'undefined') {
        contract.web3.setProvider(web3.currentProvider)
        await contract.web3.eth.getAccounts().then(async function(val){
            if(self.$store.getters['account/account'] != val[0]){
              var userAccount = val[0];              
              self.$store.dispatch('account/setAccount', userAccount )
            }
        })

        contract.web3.currentProvider.publicConfigStore.on('update', async function(val){
          var userAccount = val.selectedAddress;
          if(self.$store.getters['account/account'].toLowerCase() != userAccount){
            self.$store.dispatch('account/setAccount', userAccount)        
          }
        });
      }
    },

    computed: {
      hero() {
        return this.$store.getters['hero/hero']
      }
    },

    methods: {
      async purchase() {
        api.hero.bazaar()
      }
    },

  }
</script>