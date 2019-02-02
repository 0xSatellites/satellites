<template>
<div>
    <section class="l-information">
      <div><img :src="order.ogp" width=100%></div>
      <div class="l-information__frame">
        <div class="l-information__name">{{ order.metadata.hero_type.name.ja}} / LV.{{ order.metadata.attributes.lv}}</div>
        <div class="l-information__txt"># {{ order.metadata.attributes.id}}</div>
        <div class="l-information__txt">My Crypto Heores</div>

        <ul class="l-information__data">
        <li><span class="l-information__rarity l-item__rarity--5">★★★★★</span>{{ order.metadata.attributes.rarity}}</li>
        </ul>
        <ul class="l-information__data">
        <li><strong>HP：</strong> {{ order.metadata.attributes.hp}}</li>
        <li><strong>PHY：</strong> {{ order.metadata.attributes.phy}}</li>
        <li><strong>INT：</strong> {{ order.metadata.attributes.int}}</li>
        <li><strong>AGI：</strong> {{ order.metadata.attributes.agi}}</li>
        </ul>
        <ul class="l-information__data">
          <!-- TODO Active_sukill 有無 -->
        <li><span class="l-information__skill--type">Active</span>
          【{{ order.metadata.active_skill.name.ja}}】<br>
          {{ order.metadata.active_skill.description.ja}}
        </li>
        <li><span class="l-information__skill--type">Passive</span>
          【{{ order.metadata.passive_skill.name.ja}}】<br>
          {{ order.metadata.passive_skill.description.ja}}
        </li>
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

const config = require('../../../config.json')

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
