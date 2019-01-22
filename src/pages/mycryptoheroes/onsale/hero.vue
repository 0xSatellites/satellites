
<template>
<div>
  <h2>Market: Hero</h2>
  <v-layout row wrap>
    <div class="text-xs-center centered-element" v-if="initialising">
      <v-progress-circular
        indeterminate
      ></v-progress-circular>
    </div>
    <v-flex xs6 sm4 lg2 v-for="(item,i) in heroes" :key="i">
        <v-card class="rounded ma-2" :to="'../detail/hero/' + item.data">
          <v-card-title primary-title>
            <div>
              <div class="headline">{{item.metadata.attributes.rarity}}</div>
              <span class="grey--text">Lv. {{item.metadata.attributes.lv}}</span>
            </div>
          </v-card-title>
          <v-card-text><img v-bind:src="item.metadata.image" width="100%" alt=""></v-card-text>
          <v-card-text>{{item.metadata.attributes.hero_name}}</v-card-text>
          <v-card-text>{{item.price }} ETH</v-card-text>
          <!-- <v-card-actions><v-btn  :disabled="item.seller == userAccount" block>{{item.price / 1000000000000000000}} ETH</v-btn></v-card-actions> -->
        </v-card>
    </v-flex>
    <v-btn block color="grey darken-3 rounded" @click="load" v-if="0 < heroes.length && heroes.length < balance">
      Load More
      <v-progress-circular size=18 class="ma-2" v-if="loading"
        indeterminate
      ></v-progress-circular>       
    </v-btn>
  </v-layout>
</div>  
</template>

<script>

  import axios from 'axios'
  import contract from '~/assets/js/contract';

  export default {
    data() {
      return {
        initialising: true,        
        loading: false,
        // heroes: [{"name":"MCH Hero: #30040157 Lv.1","description":"HeroName: Mata Hari","image":"https://www.mycryptoheroes.net/images/heroes/2000/3004.png","attributes":{"active_skill":"Rest","agi":20,"hero_name":"Mata Hari","hp":45,"id":30040157,"int":19,"lv":1,"passive_skill":"Eye of the day","phy":14,"rarity":"Rare"},"external_url":"https://www.mycryptoheroes.net/heroes/30040157","image_url":"https://www.mycryptoheroes.net/images/heroes/2000/3004.png","home_url":"https://www.mycryptoheroes.net"},{"name":"MCH Hero: #30050132 Lv.1","description":"HeroName: ETHEREMON-BLUE","image":"https://www.mycryptoheroes.net/images/heroes/2000/3005.png","attributes":{"active_skill":"Rest","agi":17,"hero_name":"ETHEREMON-BLUE","hp":57,"id":30050132,"int":19,"lv":1,"passive_skill":"Omnom Tactics","phy":13,"rarity":"Rare"},"external_url":"https://www.mycryptoheroes.net/heroes/30050132","image_url":"https://www.mycryptoheroes.net/images/heroes/2000/3005.png","home_url":"https://www.mycryptoheroes.net"},{"name":"MCH Hero: #20020031 Lv.1","description":"HeroName: Spartacus","image":"https://www.mycryptoheroes.net/images/heroes/2000/2002.png","attributes":{"active_skill":"Rest","agi":12,"hero_name":"Spartacus","hp":63,"id":20020031,"int":12,"lv":1,"passive_skill":"Gladiator War","phy":13,"rarity":"Uncommon"},"external_url":"https://www.mycryptoheroes.net/heroes/20020031","image_url":"https://www.mycryptoheroes.net/images/heroes/2000/2002.png","home_url":"https://www.mycryptoheroes.net"},{"name":"MCH Hero: #20020353 Lv.3","description":"HeroName: Spartacus","image":"https://www.mycryptoheroes.net/images/heroes/2000/2002.png","attributes":{"active_skill":"Rest","agi":13,"hero_name":"Spartacus","hp":78,"id":20020353,"int":13,"lv":3,"passive_skill":"Gladiator War","phy":14,"rarity":"Uncommon"},"external_url":"https://www.mycryptoheroes.net/heroes/20020353","image_url":"https://www.mycryptoheroes.net/images/heroes/2000/2002.png","home_url":"https://www.mycryptoheroes.net"}],
      }
    },

    /* 
    async asyncData({ store, params }) {

      await Promise.all(
        [
         store.dispatch('heroes/initial', 0),
         store.dispatch('heroes/balance')
         ]
      )

    },
    */

    mounted: async function() {
      var self = this
      if(!this.$store.getters['heroes/heroes'].length) {

        await Promise.all(
          [
          this.$store.dispatch('heroes/initial'),
          this.$store.dispatch('heroes/balance'),
          this.$store.dispatch('heroes/initial')
          ]
        )

      }

      this.initialising = false;

      if(typeof web3 !== 'undefined') {
        contract.web3.setProvider(web3.currentProvider)
        await contract.web3.eth.getAccounts().then(async function(val){
            if(self.$store.getters['account/account'] != val[0]){
              var userAccount = val[0];              
              self.$store.dispatch('account/setAccount', userAccount.toLowerCase() )
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
      // ...mapGetters('questions', ['questions'])
      heroes() {
        return this.$store.getters['heroes/heroes']
      },

      balance() {
        return this.$store.getters['heroes/balance']
      },

      userAccount() {
        return this.$store.getters['account/account']
      },

      orders() {
        return this.$store.getters['orders/orders']
      },
    },

    methods: {
      // ...mapGetters('questions', ['questions'])
      async load() {
        this.loading = true
        await this.$store.dispatch('heroes/load', this.$store.getters['heroes/heroes'].length)
        this.loading = false
      }

    },


  }

</script>
