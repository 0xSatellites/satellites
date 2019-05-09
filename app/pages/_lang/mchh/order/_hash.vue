<template>
    <section class="l-information" v-if="order.asset === mchh">
      <orderHash
        :type="type"
      ></orderHash>
    </section>
</template>
<script>
import client from '~/plugins/ethereum-client'
import firestore from '~/plugins/firestore'
import OrderHash from '~/components/orderHash'
import '@fortawesome/fontawesome-free/css/all.css'

const project = process.env.project
const config = require('../../../../config.json')
const mchh = config.contract[project].mchh

export default {
  components: {
    OrderHash
  },
  data() {
    return {
      mchh,
      type: { name: 'マイクリ', symbol: 'mchh' },
    }
  },
  async asyncData({ store, params, error }) {
    try {
      const order = await firestore.doc('order', params.hash)
      await store.dispatch('order/setOrder', order)
    } catch(err){
      error({ statusCode: 404, message: 'Post not found' })
    }
  },
  computed: {
    order() {
      return this.$store.getters['order/order']
    }
  }
}
</script>

