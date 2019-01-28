<template>
<div>
    <!-- <div>
        <div>{{order}}</div>
        <div><img :src="order.ogp"></div>
        <input type ="button" @click="purchase" value="purchase">
        <input type ="button" @click="cancel" value="cancel">
        <price-chart-component></price-chart-component>
    </div> -->
      <section class="l-information">
        <div><img :src="order.ogp"></div>
        <div class="l-information__frame">
          <div class="l-information__name">伊達政宗 / LV.99</div>
          <div class="l-information__txt">#30010206</div>
          <div class="l-information__txt">My Crypto Heores</div>

          <ul class="l-information__data">
          <li><span class="l-information__rarity l-item__rarity--5">★★★★★</span>Epic</li>
          </ul>
          <ul class="l-information__data">
          <li><strong>HP：</strong> 20</li>
          <li><strong>PHY：</strong> 20</li>
          <li><strong>INT：</strong> 20</li>
          <li><strong>AGI：</strong> 20</li>
          </ul>
          <ul class="l-information__data">
          <li><span class="l-information__skill--type">Active</span>ホワイトキャンディー</li>
          <li><span class="l-information__skill--type">Passive</span>独眼竜</li>
          </ul>

          <div class="l-information__action">
            <!-- 条件分岐 order statusがselling以外は消す -->
            <div class="l-information__action__btn" @click="purchase" value="purchase">購入する</div>
        </div>
      </div>
      </section>
       <price-chart-component></price-chart-component>

  </div>
</template>

<script>
import client from '~/plugins/ethereum-client'
import db from '~/plugins/db'
import PriceChartComponent from '~/components/pricechart'

const config = require('../../config.json')

export default {
  head() {
    var order = this.order
    return {
      meta: [{ hid: 'og:image', property: 'og:image', content: order.ogp }]
    }
  },
  components: {
    PriceChartComponent
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
          [order.proxy, order.maker, order.taker, order.artEditRoyaltyRecipient, order.maker],
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
          [order.proxy, order.maker, order.taker, order.artEditRoyaltyRecipient],
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
