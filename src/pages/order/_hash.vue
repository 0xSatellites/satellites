<template>
    <div>
        <div>{{order}}</div>
        <div><img :src="order.ogp"></div>
        <input type ="button" @click="purchase" value="purchase">
        <input type ="button" @click="cancel" value="cancel">
    </div>
</template>

<script>
import client from '~/plugins/ethereum-client'
import db from '~/plugins/db'

const config = require('../../config.json')

export default {
  head() {
    var order = this.order
    return {
      meta: [{ hid: 'og:image', property: 'og:image', content: order.ogp }]
    }
  },
  async asyncData({ store, params }) {
    const order = await db.getOrderByKey(params.hash)
    await store.dispatch('order/setOrder', order)
  },
  mounted: async function() {
    const store = this.$store
    if (typeof web3 != 'undefined') {
      if (!client.account.address) {
        //initialize web3 client
        const account = await client.activate(web3.currentProvider)
        store.dispatch('account/setAccount', account)
      }
    }
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
      const account = this.account
      const order = this.order
      await client.contract.bazaaar_v1.methods
        .orderMatch_(
          [
            order.proxy,
            order.maker,
            order.taker,
            order.artEditRoyaltyRecipient,
            order.maker
          ],
          [order.id, order.price, order.artEditRoyaltyRatio, order.salt],
          order.v,
          order.r,
          order.s
        )
        .send({ from: account.address, value: order.price })
        .on('transactionHash', function(hash) {
          console.log(hash)
        })
    },
    async cancel() {
      const account = this.account
      const order = this.order
      await client.contract.bazaaar_v1.methods
        .orderCancell_(
          [
            order.proxy,
            order.maker,
            order.taker,
            order.artEditRoyaltyRecipient
          ],
          [order.id, order.price, order.artEditRoyaltyRatio, order.salt],
          order.v,
          order.r,
          order.s
        )
        .send({ from: account.address })
        .on('transactionHash', function(hash) {
          console.log(hash)
        })
    }
  }
}
</script>
