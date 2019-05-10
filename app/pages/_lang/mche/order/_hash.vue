<template>
  <div>
    <orderHash></orderHash>
  </div>
</template>
<script>
import OrderHash from '~/components/orderHash'
import firestore from '~/plugins/firestore'

export default {
  components: {
    OrderHash
  },
  head() {
    return {
      meta: [
        { hid: 'og:title', property: 'og:title', content: this.$t('meta.title') },
        { hid: 'og:description', property: 'og:description', content: this.$t('meta.description') },
        { hid: 'og:image', property: 'og:image', content: this.order.ogp }
      ]
    }
  },
  async asyncData({ store, params, error }) {
    const order = await firestore.doc('order', params.hash)
    await store.dispatch('order/setOrder', order)
  },
  computed: {
    order() {
      return this.$store.getters['order/order']
    }
  }
}
</script>
