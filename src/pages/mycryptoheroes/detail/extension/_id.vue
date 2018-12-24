<template>
  <v-layout>
    <v-layout row wrap>
      <v-flex xs12 lg6>
          <div class="mx-5 my-2 pa-3">
            <v-card-text><img v-bind:src="extension.image" width="100%" alt=""></v-card-text>
          </div>
      </v-flex>
      <v-flex xs12 lg6>
        <v-card class="mx-1 my-2 pa-3">
          <v-card-title primary-title>
            <div>
              <div class="headline">{{extension.attributes.extension_name}}</div>
              <span class="grey--text">{{extension.name}}</span>
            </div>
          </v-card-title>
          <v-card-text>

            <v-layout row wrap>
              <v-flex xs3>HP: {{extension.attributes.hp}}</v-flex>
              <v-flex xs3>PHY: {{extension.attributes.phy}}</v-flex>
              <v-flex xs3>INT: {{extension.attributes.int}}</v-flex>
              <v-flex xs3>AGI: {{extension.attributes.agi}}</v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12>Passive Skill: {{extension.attributes.passive_skill}}</v-flex>
              <v-flex xs12>Active Skill: {{extension.attributes.active_skill}}</v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12>Price: 0.002 ETH</v-flex>
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
        //extensions: [{"name":"MCH Extension: #30020200 Lv.68","description":"ExtensionName: Brave Musket\nNickname: Brave Musket","image":"https://www.mycryptoextensiones.net/images/extensions/2000/3002.png","attributes":{"active_skill":"Brave Shots","agi":26,"extension_name":"Brave Musket","hp":3,"int":77,"lv":68,"phy":1,"rarity":"Rare"},"external_url":"https://www.mycryptoextensiones.net/extensions/30020200","image_url":"https://www.mycryptoextensiones.net/images/extensions/2000/3002.png","home_url":"https://www.mycryptoextensiones.net"}]
      }
    },

    async asyncData({ store, params }) {
      await store.dispatch('extension/detail', params.id)
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
      extension() {
        return this.$store.getters['extension/extension']
      }
    },

    methods: {
      async purchase() {
        api.extension.bazaar()
      }
    },
  }
</script>