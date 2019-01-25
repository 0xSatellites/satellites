<template>
<div>
    <h2>MyItems</h2>
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
        userAccount: ""
      }
    },

    mounted: async function() {
      var self = this
      if(typeof web3 !== 'undefined') {
        contract.web3.setProvider(web3.currentProvider)
        await contract.web3.eth.getAccounts().then(async function(val){
            if(self.$store.getters['account/account'] != val[0]){
              var userAccount = val[0];
              self.$store.dispatch('account/setAccount', userAccount.toLowerCase() )
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
