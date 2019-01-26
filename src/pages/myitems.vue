<template>
    <div>
        <div>
            <p>アドレス:{{account.address}}</p>
            <p>残高:{{account.balance}}</p>
        </div>
        <div v-for="(mchh, i) in myitems.mchh" :key="i">
            <div>
                <a :href="'/mchh/' + mchh">
                    {{mchh}}
                </a>
            </div>
        </div>
    </div>
</template>

<script>

  import axios from 'axios'
  import client from '~/plugins/ethereum-client'

  export default {

    data: function () {
      return {
      }
    },

    mounted: async function() {
    },

    computed: {
      account() {
        return this.$store.getters['account/account']
      },
      myitems() {
        return this.$store.getters['myitems/myitems']
      }
    },

    methods: {

    }

  }

</script>
