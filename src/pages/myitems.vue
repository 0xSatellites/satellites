<template>
    <div>
        <div>
            <p>アドレス:{{account.address}}</p>
            <p>残高:{{account.balance}}</p>
        </div>
        <div>
            <div class="card">
                <a href="./detail.html">
                    <img src="https://www.mycryptoheroes.net/images/heroes/2000/4009.png" alt="" width="100">
                    <p>Lv:70</p>
                </a>
            </div>
        </div>
    </div>
</template>

<script>

  import axios from 'axios'
  import account from '~/assets/js/contract'

  export default {

    data: function () {
      return {
      }
    },

    mounted: async function() {
      if(typeof web3 != 'undefined'){
        const account = await contract.activate(web3.currentProvider)
        this.$store.dispatch('account/setAccount', account)
      } else {

      }
    },

    computed: {
      account() {
        return this.$store.getters['account/account']
      },
    },

    methods: {

    }

  }

</script>
