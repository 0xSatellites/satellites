<template>
    <div>
        <div>{{order}}</div>
        <input type ="button" @click="purchase" value="purchase">
        <input type ="button" @click="cancel" value="cancel">
    </div>
</template>

<script>

  import client from '~/plugins/ethereum-client'
  import db from '~/plugins/db'

  const config = require('../../config.json')

  export default {

    data: function () {
      return {
      }
    },

    async asyncData({ store, params }) {
        const order = await db.getDocByKey(params.hash)
        await store.dispatch('order/setOrder', order)
    },

    mounted: async function() {
    },

    computed: {
      account() {
        return this.$store.getters['account/account']
      },
      order() {
        return this.$store.getters['order/order']
      }
    },

    methods: {
      async purchase() {
        await client.contract.bazaaar_v1.methods.orderMatch_([
            this.order.proxy,
            this.order.maker,
            this.order.taker,
            this.order.artEditRoyaltyRecipient,
            this.order.maker
        ], [
            this.order.id,
            this.order.price,
            this.order.artEditRoyaltyRatio,
            this.order.salt
        ],  this.order.v,
            this.order.r,
            this.order.s
        )
        .send({ from: this.account.address, value: this.order.price})
        .on('transactionHash', function(hash){
          console.log(hash)
        })
      },

      async cancel() {
        await client.contract.bazaaar_v1.methods.orderCancell_([
            this.order.proxy,
            this.order.maker,
            this.order.taker,
            this.order.artEditRoyaltyRecipient,
        ], [
            this.order.id,
            this.order.price,
            this.order.artEditRoyaltyRatio,
            this.order.salt
        ],  this.order.v,
            this.order.r,
            this.order.s
        )
        .send({ from: this.account.address})
        .on('transactionHash', function(hash){
          console.log(hash)
        })
      }
    }

  }

</script>
