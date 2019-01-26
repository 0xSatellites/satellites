<template>
<div>
    <p>{{order.hash}}</p>
    <p>{{order.price / 1000000000000000000 }} ETH</p>
    <p>{{order.metadata.name}}</p>
    <p>{{order.metadata.attributes.hp}}</p>
    <p>{{order.metadata.attributes.phy}}</p>
    <p>{{order.metadata.attributes.int}}</p>
    <p>{{order.metadata.attributes.agi}}</p>

    <v-btn block dark large @click="purchase" :disabled="loading" v-if="userAccount != order.maker">
            {{order.price / 1000000000000000000 }} ETH
        <v-progress-circular size=18 class="ma-2" v-if="loading"
        indeterminate
        ></v-progress-circular>
    </v-btn>
    <v-btn block dark large @click="cancel" :disabled="loading" v-if="userAccount == order.maker">
            Cancel
        <v-progress-circular size=18 class="ma-2" v-if="loading"
        indeterminate
        ></v-progress-circular>
    </v-btn>
</div>
</template>

<script>

  import axios from 'axios'
  import contract from '~/assets/js/account';

  export default {
    data() {
      return {
        loading:false
      }
    },

    async asyncData({ store, params }) {
      var query = {
        key:'hash',
        value: params.hash
      }
      await store.dispatch('order/detail', query)
    },

    async mounted() {
      var self = this
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
          if(self.$store.getters['account/account'] != userAccount){
            self.$store.dispatch('account/setAccount', userAccount)
          }
        });
      }
    },

    computed: {
      userAccount() {
        return this.$store.getters['account/account']
      },
      order(){
        return this.$store.getters['order/order']
      }
    },

    methods: {
      async purchase() {
        var userAccount = this.$store.getters['account/account']
        var order = this.$store.getters['order/order']

        await contract.bazaaar.methods.orderMatch_([
            order.proxy,
            order.maker,
            order.taker,
            order.artEditRoyaltyRecipient,
            order.maker
        ], [
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
            order.salt
        ],  order.v,
            order.r,
            order.s
        )
        .send({ from: userAccount, value: order.price})
        .on('transactionHash', function(hash){
          console.log(hash)
        })
      },

      async cancel() {
        var userAccount = this.$store.getters['account/account']
        var order = this.$store.getters['order/order']

        await contract.bazaaar.methods.orderCancell_([
            order.proxy,
            order.maker,
            order.taker,
            order.artEditRoyaltyRecipient,
        ], [
            order.id,
            order.price,
            order.artEditRoyaltyRatio,
            order.salt
        ],  order.v,
            order.r,
            order.s
        )
        .send({ from: userAccount})
        .on('transactionHash', function(hash){
          console.log(hash)
        })
      },

    }
  }
</script>