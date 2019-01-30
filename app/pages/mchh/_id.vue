<template>
    <div>
      <section class="l-item">
        <div class="l-item__frame">
        <div>
        <div class="l-item__img">
          <img :src="asset.mchh.cache_image" alt="">
          <img src="https://ipfs.infura.io/ipfs/QmTauj6WRifc3fXowFRgs27U7HSmSMNbvEdPzQqDZ9ERwB" alt="">
          </div>
        </div>
        <div>
        <div class="l-item__name">{{asset.mchh.attributes.hero_name }} / LV.{{asset.mchh.attributes.lv }}</div>
        <div class="l-item__txt"># {{asset.mchh.attributes.id }}</div>
        <div class="l-item__txt">My Crypto Heores</div>

        <ul class="l-item__data">
        <li><span class="l-item__rarity l-item__rarity--5">★★★★★</span>{{asset.mchh.attributes.rarity }}</li>
        </ul>
        <ul class="l-item__data">
        <li><strong>HP：</strong> {{asset.mchh.attributes.hp }}</li>
        <li><strong>PHY：</strong> {{asset.mchh.attributes.phy }}</li>
        <li><strong>INT：</strong> {{asset.mchh.attributes.int }}</li>
        <li><strong>AGI：</strong> {{asset.mchh.attributes.agi }}</li>
        </ul>
        <ul class="l-item__data">
          <!-- TODO 条件分岐 Active有無 -->
        <li><span class="l-item__skill--type">Active</span></li>
        <li><span class="l-item__skill--type">Passive</span>{{asset.mchh.attributes.passive_skill }}</li>
        </ul>

        <form>
        <div class="l-item__action">

        <div class="l-item__action__price"><label><input type="text" value="" id="amount"> ETH</label></div>

        <div class="l-item__action__btns">
          <div class="l-item__action__btn l-item__action__btn--type1" @click="order_v1" value=Sell>出品する</div>
          <!-- TODOキャンセル、金額変更処理 -->
          <!-- <div class="l-item__action__btn l-item__action__btn--type1">金額変更する</div> -->
          <!-- <div class="l-item__action__btn l-item__action__btn--type2" @click="cancel" value="cancel">キャンセルする</div> -->
        </div>

        </div>
        </form>
      </div>
      </div>
      </section>
      <section class="c-price">
        <price-chart-component id="myChart"></price-chart-component>
      </section>
      <canvas id="ogp" width="1200" height="630" hidden></canvas>
    </div>
</template>

<script>
import db from '~/plugins/db'
import canvas from '~/plugins/canvas'
import PriceChartComponent from '~/components/pricechart'
import client from '~/plugins/ethereum-client'
import storage from '~/plugins/storage'
import template from '~/assets/ogp_template.svg'

const config = require('../../../config.json')

export default {
  components: {
    PriceChartComponent
  },
  async asyncData({ store, params }) {
    const asset = await db.getAssetByKey('mchh_' + params.id)
    await store.dispatch('asset/setMchh', asset)
  },
  mounted: async function() {
    const store = this.$store
    if (typeof web3 != 'undefined') {
      if (!client.account.address) {
        //initialize web3 client
        const account = await client.activate(web3.currentProvider)
        store.dispatch('account/setAccount', account)

        //const order = await db.getOrderByHistory(account)
        //await store.dispatch('order/setOrder', order)
      }
      //initialize canvas client
      canvas.initialize('ogp')
    }
  },
  computed: {
    account() {
      return this.$store.getters['account/account']
    },
    asset() {
      return this.$store.getters['asset/asset']
    }
    // order() {
    //   return this.$store.getters['order/order']
    // }
  },
  methods: {
    async order_v1() {
      console.log('order_v1')
      const router = this.$router
      const address = this.account.address
      const params = this.$route.params
      const asset = this.asset.mchh
      const amount = document.getElementById('amount').value
      const wei = client.utils.toWei(amount)
      const approved = await client.contract.mchh.methods
        .isApprovedForAll(address, client.contract.bazaaar_v1.options.address)
        .call({from:this.account.address})
      if (approved) {
        canvas.draw(template, asset, amount)
        const salt = Math.floor(Math.random() * 1000000000)
        const order = {
          proxy: client.contract.bazaaar_v1.options.address,
          maker: address,
          taker: config.constant.nulladdress,
          artEditRoyaltyRecipient: address,
          id: params.id,
          price: wei,
          artEditRoyaltyRatio: 600,
          salt: salt
        }

        const hash = await client.finalizeOrder(order)
        const base64 = canvas.generate().substr(22)
        order.ogp = await storage.ogp(hash, base64)
        order.hash = hash
        order.metadata = asset
        await db.set(config.constant.order, hash, order)
        router.push({ path: '/order/' + hash})
      } else {
        client.contract.mchh.methods
          .setApprovalForAll(client.contract.bazaaar_v1._address, true)
          .send({ from: this.account.address })
      }
    }
  }
}
</script>
