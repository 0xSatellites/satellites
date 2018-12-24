<template>
  <v-layout row wrap>
    <div class="text-xs-center centered-element" v-if="initialising">
      <v-progress-circular
        indeterminate
      ></v-progress-circular>
    </div>
    <v-flex xs6 sm4 lg2 v-for="(item,i) in inventory" :key="i">
        <v-card class="rounded ma-2" :to="'./detail/hero/' + item.attributes.id" v-if="i < breakpoint">
          <v-card-title primary-title>
            <div>
              <div class="headline">{{item.attributes.rarity}}</div>
              <span class="grey--text">Lv. {{item.attributes.lv}}</span>
            </div>
          </v-card-title>
          <v-card-text><img v-bind:src="item.image" width="100%" alt=""></v-card-text>
          <v-card-text>{{item.name}}</v-card-text>
        </v-card>
        <v-card class="rounded ma-2" :to="'./detail/extension/' + item.name.substring(16, 24)" v-else>
          <v-card-title primary-title>
            <div>
              <div class="headline">{{item.attributes.rarity}}</div>
              <span class="grey--text">Lv. {{item.attributes.lv}}</span>
            </div>
          </v-card-title>
          <v-card-text><img v-bind:src="item.image" width="100%" alt=""></v-card-text>
          <v-card-text>{{item.name}}</v-card-text>
        </v-card>
    </v-flex>
    <v-btn block color="grey darken-3 rounded" @click="load" v-if="0 < inventory.length && inventory.length < balance">
      Load More
      <v-progress-circular size=18 class="ma-2" v-if="loading"
        indeterminate
      ></v-progress-circular>       
    </v-btn>
  </v-layout>
</template>

<script>

  import axios from 'axios'
  import contract from '~/assets/js/contract';

  export default {
    data() {
      return {
        initialising: true,        
        loading: false,
        userAccount: ""
        //inventory: [{"name":"MCH Hero: #30040157 Lv.1","description":"HeroName: Mata Hari","image":"https://www.mycryptoinventory.net/images/inventory/2000/3004.png","attributes":{"active_skill":"Rest","agi":20,"hero_name":"Mata Hari","hp":45,"id":30040157,"int":19,"lv":1,"passive_skill":"Eye of the day","phy":14,"rarity":"Rare"},"external_url":"https://www.mycryptoinventory.net/inventory/30040157","image_url":"https://www.mycryptoinventory.net/images/inventory/2000/3004.png","home_url":"https://www.mycryptoinventory.net"},{"name":"MCH Hero: #30050132 Lv.1","description":"HeroName: ETHEREMON-BLUE","image":"https://www.mycryptoinventory.net/images/inventory/2000/3005.png","attributes":{"active_skill":"Rest","agi":17,"hero_name":"ETHEREMON-BLUE","hp":57,"id":30050132,"int":19,"lv":1,"passive_skill":"Omnom Tactics","phy":13,"rarity":"Rare"},"external_url":"https://www.mycryptoinventory.net/inventory/30050132","image_url":"https://www.mycryptoinventory.net/images/inventory/2000/3005.png","home_url":"https://www.mycryptoinventory.net"},{"name":"MCH Hero: #20020031 Lv.1","description":"HeroName: Spartacus","image":"https://www.mycryptoinventory.net/images/inventory/2000/2002.png","attributes":{"active_skill":"Rest","agi":12,"hero_name":"Spartacus","hp":63,"id":20020031,"int":12,"lv":1,"passive_skill":"Gladiator War","phy":13,"rarity":"Uncommon"},"external_url":"https://www.mycryptoinventory.net/inventory/20020031","image_url":"https://www.mycryptoinventory.net/images/inventory/2000/2002.png","home_url":"https://www.mycryptoinventory.net"},{"name":"MCH Hero: #20020353 Lv.3","description":"HeroName: Spartacus","image":"https://www.mycryptoinventory.net/images/inventory/2000/2002.png","attributes":{"active_skill":"Rest","agi":13,"hero_name":"Spartacus","hp":78,"id":20020353,"int":13,"lv":3,"passive_skill":"Gladiator War","phy":14,"rarity":"Uncommon"},"external_url":"https://www.mycryptoinventory.net/inventory/20020353","image_url":"https://www.mycryptoinventory.net/images/inventory/2000/2002.png","home_url":"https://www.mycryptoinventory.net"}],
      }
    },

    /* 
    async asyncData({ store, params }) {

      await Promise.all(
        [
         store.dispatch('inventory/initial', 0),
         store.dispatch('inventory/balance')
         ]
      )

    },
    */

    mounted: async function() {
     
      var self = this
      if(typeof web3 !== 'undefined') {
        contract.web3.setProvider(web3.currentProvider)
        await contract.web3.eth.getAccounts().then(async function(val){
            if(self.$store.getters['account/account'] != val[0]){
              var userAccount = val[0];              
              self.$store.dispatch('account/setAccount', userAccount )
              self.$store.dispatch('inventory/clear', userAccount)
              await Promise.all(
                [
                self.$store.dispatch('inventory/initial', userAccount, 0),
                self.$store.dispatch('inventory/balance', userAccount),
                self.$store.dispatch('inventory/breakpoint', userAccount)
                ]
              )
            }
        })

        contract.web3.currentProvider.publicConfigStore.on('update', async function(val){
          var userAccount = val.selectedAddress;
          if(self.$store.getters['account/account'].toLowerCase() != userAccount){
            self.$store.dispatch('account/setAccount', userAccount)
            self.$store.dispatch('inventory/clear', userAccount)
            await Promise.all(
              [
              self.$store.dispatch('inventory/initial', userAccount, 0),
              self.$store.dispatch('inventory/balance', userAccount),
              self.$store.dispatch('inventory/breakpoint', userAccount)
              ]
            )            
          }
        });

      }

      this.initialising = false;
    },    

    computed: {
      // ...mapGetters('questions', ['questions'])
      inventory() {
        return this.$store.getters['inventory/inventory']
      },

      balance() {
        return this.$store.getters['inventory/balance']
      },

      breakpoint() {
        return this.$store.getters['inventory/breakpoint']
      }

    },

    methods: {
      // ...mapGetters('questions', ['questions'])
      async load() {
        var self = this
        this.loading = true

        if(typeof web3 !== 'undefined') {
          var userAccount
          await contract.web3.eth.getAccounts().then(function(val){
              userAccount = val[0]
          })
          if(self.userAccount != userAccount){
            await this.$store.dispatch('inventory/clear')
            self.userAccount = userAccount
          }
        }

        var param = {
          address : this.userAccount,
          from: this.$store.getters['inventory/inventory'].length
        }

        await this.$store.dispatch('inventory/load', param)
        this.loading = false
      }

    },


  }

</script>
