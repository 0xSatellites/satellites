<template>
  <v-layout>
    <v-layout row wrap>
      <v-flex xs12 lg6>
          <div class="mx-5">
            <v-card-text><img v-bind:src="extension.image" width="100%" alt=""></v-card-text>
          </div>
      </v-flex>
      <v-flex xs12 lg6>
        <v-card class="my-3 pa-2">
          <v-card-title primary-title>
            <div>
              <div class="headline">{{extension.attributes.extension_name}} - Lv.{{extension.attributes.lv}}</div>
              <div class="grey--text">{{extension.name}}</div>
              <div class="caption"><a :href="extension.external_url"> {{extension.external_url}}</a></div>
            </div>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs3>HP:<span class="title font-weight-light"> {{extension.attributes.hp}}</span></v-flex>
              <v-flex xs3>PHY:<span class="title font-weight-light"> {{extension.attributes.phy}}</span></v-flex>
              <v-flex xs3>INT:<span class="title font-weight-light"> {{extension.attributes.int}}</span></v-flex>
              <v-flex xs3>AGI:<span class="title font-weight-light"> {{extension.attributes.agi}}</span></v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12><v-chip color="red lighten-4">Active : {{extension.attributes.active_skill}}</v-chip></v-flex>
            </v-layout>
          </v-card-text>   

          <v-card-actions v-if="extension.onSale && extension.seller != userAccount">
            <v-btn block dark large @click="purchase" :disabled="loading">
              {{extension.price / 1000000000000000000}} ETH
              <v-icon right>shopping_cart</v-icon>
              <v-progress-circular size=18 class="ma-2" v-if="loading"
                indeterminate
              ></v-progress-circular>  
            </v-btn>
          </v-card-actions>
          <v-card-actions v-if="extension.onSale && extension.seller == userAccount">
            <v-btn block dark large @click="cancel" :disabled="loading">
              Cancel
              <v-icon right>undo</v-icon>
              <v-progress-circular size=18 class="ma-2" v-if="loading"
                indeterminate
              ></v-progress-circular>  
            </v-btn>
            <v-btn block dark large @click="change" :disabled="loading">
              {{extension.price / 1000000000000000000}} ETH
              <v-icon right>cached</v-icon>
              <v-progress-circular size=18 class="ma-2" v-if="loading"
                indeterminate
              ></v-progress-circular>    
            </v-btn>
          </v-card-actions>          
          <v-card-actions v-if="extension.owner == userAccount">
            <v-btn block dark large @click="sell" :disabled="loading">
              Sell
              <v-icon right v-if="!loading">store</v-icon>
              <v-progress-circular size=18 class="ma-2" v-if="loading"
                indeterminate
              ></v-progress-circular>                
            </v-btn>
          </v-card-actions>


        </v-card>
      </v-flex>


    </v-layout>
  </v-layout>
</template>

<script>

  import axios from 'axios'
  import client from '~/assets/js/ethereum-client';

  export default {
    data() {
      return {
        loading:false, 
        approved:false        
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
      extension() {
        return this.$store.getters['extension/extension']
      },
      userAccount() {
        return this.$store.getters['account/account']
      }
    },

    methods: {
      async purchase() {
        var self = this
        this.loading = true

        contract.bazaaar.methods.purchase(contract.extension._address , this.$route.params.id)
        .send({from: this.$store.getters['account/account'], value: this.$store.getters['extension/extension'].price})
        .on('transactionHash', function(hash){
          console.log(hash)
          alert("This item will be yours. Please wait for the confirmation. Tx: " + hash)
          self.approved = false;            
        })
        .on('confirmation', function(confirmationNumber, receipt){
          self.$store.dispatch('extension/detail', self.$route.params.id)
          self.$store.dispatch('extensions/initial'),
          self.$store.dispatch('extensions/balance'),
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
      },
      async sell() {
        var self = this
        this.loading = true;

        await contract.extension.methods.isApprovedForAll(this.$store.getters['account/account'], contract.bazaaar._address).call().then(function(val){
            if(val){
              self.approved = true;
            }
        })

        if(this.approved) {

          var price = prompt("Please enter price.", "ETH")
          try {
            var wei = contract.web3.utils.toWei(price)
          } catch {
            alert("Please input ETH amount in number.") 
            this.loading = false;            
            return
          }

          contract.bazaaar.methods.sell(contract.extension._address , this.$route.params.id, wei)
          .send({from: this.$store.getters['account/account']})
          .on('transactionHash', function(hash){
            console.log(hash)
            alert("Your item will be on bazaaar. Please wait for the confirmation. Tx: " + hash)
          })
          .on('confirmation', function(confirmationNumber, receipt){ 
            self.$store.dispatch('extension/detail', self.$route.params.id)
            self.$store.dispatch('extensions/initial'),
            self.$store.dispatch('extensions/balance'),            
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

        } else {
            alert("You must approve bazaaar contract for the sale")
            contract.extension.methods.setApprovalForAll(contract.bazaaar._address , true)
            .send({from: this.$store.getters['account/account']})
            .on('transactionHash', function(hash){
              console.log(hash)
              alert("Now you can sell your asset on bazaaar. Tx: " + hash)
              self.approved = true;            
            })
            .on('confirmation', function(confirmationNumber, receipt){             
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
          
      },
      async cancel() {
        var self = this   
        this.loading = true

          contract.bazaaar.methods.cancel(contract.extension._address , this.$route.params.id)
          .send({from: this.$store.getters['account/account']})
          .on('transactionHash', function(hash){
            console.log(hash)
            alert("Your selling is cannceled. Please wait for the confirmation. Tx: " + hash)
            self.approved = false;            
          })
          .on('confirmation', function(confirmationNumber, receipt){
            self.$store.dispatch('extension/detail', self.$route.params.id)
            self.$store.dispatch('extensions/initial'),
            self.$store.dispatch('extensions/balance'),            
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
      },

      async change() {
        var self = this       
        this.loading = true

        var price = prompt("Please enter price.", "ETH")
        try {
          var wei = contract.web3.utils.toWei(price)
        } catch {
          alert("Please input ETH amount in number.")         
          this.loading = false;                    
          return
        }

        contract.bazaaar.methods.change(contract.extension._address , this.$route.params.id, price)
        .send({from: this.$store.getters['account/account']})
        .on('transactionHash', function(hash){
          console.log(hash)
          alert("Your selling is updated. Please wait for the confirmation. Tx: " + hash)
          self.approved = false;            
        })
        .on('confirmation', function(confirmationNumber, receipt){
          self.$store.dispatch('extension/detail', self.$route.params.id)
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
    },
  }
</script>