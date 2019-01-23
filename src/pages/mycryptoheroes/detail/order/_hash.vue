<template>
<div>
    <p>{{order.hash}}</p>
    <p>{{order.price / 1000000000000000000 }} ETH</p>
    <!-- <p>{{order.metadata.name}}</p>
    <p>{{order.metadata.attributes.hp}}</p>
    <p>{{order.metadata.attributes.phy}}</p>
    <p>{{order.metadata.attributes.int}}</p>
    <p>{{order.metadata.attributes.agi}}</p> -->

    <v-btn block dark large @click="purchase" :disabled="loading">
            {{order.price / 1000000000000000000 }}    ETH
        <v-icon right>shopping_cart</v-icon>
        <v-progress-circular size=18 class="ma-2" v-if="loading"
        indeterminate
        ></v-progress-circular>  
    </v-btn>
              
</div>
</template>

<script>

  import axios from 'axios'
  import contract from '~/assets/js/contract';

  export default {
    data() {
      return {
        loading:false, 
        approved:false 
      }
    },

    async asyncData({ store, params }) {
      await store.dispatch('order/search', params.hash)
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
        var self = this
        this.loading = true
        
        var userAccount = this.$store.getters['account/account']
        var match = this.$store.getters['order/order']
       
        await contract.bazaaar.methods.orderMatch_([
            match.proxy,
            match.maker,
            match.artEditRoyaltyRecipient,
            userAccount
        ], [
            match.id,
            match.price,
            match.artEditRoyaltyRatio,
            match.salt
        ],  match.v,
            match.r,
            match.s
            )
        .send({ from: userAccount, value:match.price})
        .on('transactionHash', function(hash){
          console.log(hash)
          alert("This item will be yours. Please wait for the confirmation. Tx: " + hash)
          self.approved = false;            
        })
        .on('confirmation', function(confirmationNumber, receipt){
          self.$store.dispatch('hero/detail', self.$route.params.id),       
          self.$store.dispatch('inventory/initial', self.$store.getters['account/account'])        
        })
        .on('receipt', function(receipt){
          console.log(receipt)
          self.loading = false          
        })
        .on('error', function(err){
            console.error(err)
            self.loading = false
        });      
      }
    }
  }
</script>