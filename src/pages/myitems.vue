<template>
    <div>
        <div>
            <p>アドレス:{{account.address}}</p>
            <p>残高:{{account.balance}}</p>
        </div>
        <div v-for="(mchh, i) in myitems.mchh" :key="i">
            <div>
                <nuxt-link :to="'/mchh/' + mchh.attributes.id">
                    {{mchh}}
                </nuxt-link>
                <div><img :src="mchh.cache_image" width="200"></div>
            </div>
        </div>
    </div>
</template>

<script>

  import db from '~/plugins/db'
  import client from '~/plugins/ethereum-client'

  export default {
    mounted: async function() {
      const store = this.$store
      const myitems = this.myitems
      if(typeof web3 != 'undefined'){
        if(!client.account.address){
          //initialize web3 client
          const account = await client.activate(web3.currentProvider)
          store.dispatch('account/setAccount', account)
        }
        if(!myitems.mchh.length){
          //get myitems:mchh
          client.ownedTokens('mchh').then(function(val){
            db.getAssetListByKey(val).then(function(val){
              store.dispatch('myitems/setMchh', val)
            })
          })
        }
        if(!myitems.mche.length){
          //get myitems:mche
          client.ownedTokens('mche').then(function(val){
            db.getAssetListByKey(val).then(function(val){
              store.dispatch('myitems/setMche', val)
            })
          })
        }
      }
    },
    computed: {
      account() {
        return this.$store.getters['account/account']
      },
      myitems() {
        return this.$store.getters['myitems/myitems']
      }
    }
  }

</script>
