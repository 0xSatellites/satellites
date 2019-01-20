<template>
  <v-layout> 
    <v-layout row wrap>
      <v-flex xs12 lg6>
          <div class="mx-5">
            <v-card-text><img v-bind:src="hero.image" width="100%" alt=""></v-card-text>
          </div>
      </v-flex>
      <v-flex xs12 lg6>
        <v-card class="my-3 pa-2">
          <v-card-title primary-title>
            <div>
              <div class="headline">{{hero.attributes.hero_name}} - Lv.{{hero.attributes.lv}}</div>
              <div class="grey--text">{{hero.name}}</div>
              <div class="caption"><a :href="hero.external_url"> {{hero.external_url}}</a></div>           
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
              <v-flex xs12><v-chip color="blue lighten-4">Passive : {{hero.attributes.passive_skill}}</v-chip></v-flex>
              <v-flex xs12><v-chip color="red lighten-4">Active : {{hero.attributes.active_skill}}</v-chip></v-flex>
            </v-layout>
          </v-card-text>   

          <v-card-actions v-if="hero.onSale && hero.seller != userAccount">
            <v-btn block dark large @click="purchase" :disabled="loading">
              {{hero.price / 1000000000000000000}} ETH
              <v-icon right>shopping_cart</v-icon>
              <v-progress-circular size=18 class="ma-2" v-if="loading"
                indeterminate
              ></v-progress-circular>  
            </v-btn>

            <v-btn block dark large @click="sell" :disabled="loading">
             test
              <v-icon right>shopping_cart</v-icon>
              <v-progress-circular size=18 class="ma-2" v-if="loading"
                indeterminate
              ></v-progress-circular>  
            </v-btn>
            
          </v-card-actions>
          <v-card-actions v-if="hero.onSale && hero.seller == userAccount">
            <v-btn block dark large @click="cancel" :disabled="loading">
              Cancel
              <v-icon right>undo</v-icon>
              <v-progress-circular size=18 class="ma-2" v-if="loading"
                indeterminate
              ></v-progress-circular>  
            </v-btn>
            <v-btn block dark large @click="change" :disabled="loading">
              {{hero.price / 1000000000000000000}} ETH
              <v-icon right>cached</v-icon>
              <v-progress-circular size=18 class="ma-2" v-if="loading"
                indeterminate
              ></v-progress-circular>    
            </v-btn>
          </v-card-actions>          
          <v-card-actions v-if="hero.owner == userAccount">
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
  import contract from '~/assets/js/contract';

  export default {
    data() {
      return {
        loading:false, 
        approved:false 
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
      hero() {
        return this.$store.getters['hero/hero']
      },
      userAccount() {
        return this.$store.getters['account/account']
      }
    },

    methods: {
      async purchase() {
        var self = this
        this.loading = true

        contract.bazaaar.methods.purchase(contract.hero._address , this.$route.params.id)
        .send({from: this.$store.getters['account/account'], value: this.$store.getters['hero/hero'].price})
        .on('transactionHash', function(hash){
          console.log(hash)
          alert("This item will be yours. Please wait for the confirmation. Tx: " + hash)
          self.approved = false;            
        })
        .on('confirmation', function(confirmationNumber, receipt){
          self.$store.dispatch('hero/detail', self.$route.params.id),
          self.$store.dispatch('heroes/initial'),
          self.$store.dispatch('heroes/balance'),          
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

        //アートエディット取得
        var lv = this.$store.getters['hero/hero'].attributes.lv
        console.log(this.$store.getters['hero/hero'])
        console.log(lv)

        //TODO アートエディット
        if(!lv > 1){
          alert("出品するにはアートエディットを行うことが必要です")
          return false;
        }

        await contract.hero.methods.getApproved(this.$route.params.id).call().then(function(val){
            //TODO swapAddress定義する store
            self.val = val
        })

        self.approved = true;
        // if(self.val.toLowerCase() === contract.bazaaar._address){
        //   self.approved = true;
        // }else{
        //   alert("You must approve bazaaar contract for the sale")
        //   contract.hero.methods.approve(contract.bazaaar._address , this.$route.params.id)
        //   .send({from: this.$store.getters['account/account']})
        //   .on('transactionHash', function(hash){
        //     console.log(hash)
        //     alert("Now you can sell your asset on bazaaar. Tx: " + hash)
        //     self.approved = true;
        //   })
        //   .on('confirmation', function(confirmationNumber, receipt){
        //   })
        //   .on('receipt', function(receipt){
        //     console.log(receipt)
        //     self.loading = false                 
        //   })
        //   .on('error', function(err){
        //     console.error(err)
        //     self.loading = false
        //   });       
        // }

        if(this.approved) {

          var price = prompt("Please enter price.", "ETH")
          try {
            var wei = contract.web3.utils.toWei(price)
          } catch {
            alert("Please input ETH amount in number.")
            this.loading = false;            
            return
          }

          //Swap contractのアドレス
          var proxy = contract.bazaaar._address
          //売る人
          var maker = this.$store.getters['account/account']
          //印税受け取る人
          var feeRecipient = "0x"
          // var feeRecipient = this.$store.getters['hero/hero'].arteditaddress
          //トークンのID
          var id = this.$route.params.id
          //価格
          // var price = 
          //hashを都度作成するためのデータ
          var salt = ""


          var data = contract.web3.utils.soliditySha3(proxy, maker, feeRecipient, id, price, salt);
          console.log(data)
          var sig = await contract.web3.eth.personal.sign(data, this.$store.getters['account/account']);



          const body ={
            "proxy": proxy,
            "maker": maker,
            "feeRecipient": feeRecipient,
            "id": id,
            "price": price,
            "salt": salt,
            "data": data,
            "sig": sig,
            // "metadata": this.$store.getters['hero/hero'],
            // "flag": 1,
          }

          console.log(body)

          try {
            this.$axios.$post(process.env.API +'orders/set', body)
            .then(response => {
              console.log(response)

              //TODO sellボタン表示変更
              self.loading = false
              
            })
            } catch (error) {
              console.error(error)
              self.loading = false
            }


          // contract.bazaaar.methods.sell(contract.hero._address , this.$route.params.id, wei)
          // .send({from: this.$store.getters['account/account']})
          // .on('transactionHash', function(hash){
          //   console.log(hash)
          //   alert("Your item will be on bazaaar. Please wait for the confirmation. Tx: " + hash)
          // })
          // .on('confirmation', function(confirmationNumber, receipt){
          //   self.$store.dispatch('hero/detail', self.$route.params.id),
          //   self.$store.dispatch('heroes/initial'),
          //   self.$store.dispatch('heroes/balance'),  
          //   self.$store.dispatch('inventory/initial', self.$store.getters['account/account'])                

          // })
          // .on('receipt', function(receipt){
          //   console.log(receipt)
          //   self.loading = false             
          // })
          // .on('error', function(err){
          //     console.error(err)
          //     self.loading = false
          // });         

        } else {
           
        }
          
      },
      async cancel() {
        // TODO署名無効化
        var self = this
        this.loading = true

          contract.bazaaar.methods.cancel(contract.hero._address , this.$route.params.id)
          .send({from: this.$store.getters['account/account']})
          .on('transactionHash', function(hash){
            console.log(hash)
            alert("Your selling is cannceled. Please wait for the confirmation. Tx: " + hash)
            self.approved = false;            
          })
          .on('confirmation', function(confirmationNumber, receipt){
            self.$store.dispatch('hero/detail', self.$route.params.id),
            self.$store.dispatch('heroes/initial'),
            self.$store.dispatch('heroes/balance'),              
            self.$store.dispatch('inventory/initial', self.$store.getters['account/account'])                 
          })
          .on('receipt', function(receipt){
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

        contract.bazaaar.methods.change(contract.hero._address , this.$route.params.id, price)
        .send({from: this.$store.getters['account/account']})
        .on('transactionHash', function(hash){
          console.log(hash)
          alert("Your selling is updated. Please wait for the confirmation. Tx: " + hash)
          self.approved = false;            
        })
        .on('confirmation', function(confirmationNumber, receipt){
          self.$store.dispatch('hero/detail', self.$route.params.id)
        })
        .on('receipt', function(receipt){
          console.log(receipt)
          this.loading = false;            
        })
        .on('error', function(err){
            console.error(err)
            self.loading = false
        });     
      }
      
    },

  }
</script>