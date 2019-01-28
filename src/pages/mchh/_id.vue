<template>
    <div>
      <p>{{asset}}</p>
      <div><img :src="asset.mchh.cache_image" width="200"></div>
      <input type="text" id="amount">
      <input type ="button" @click="order_v1" value=Sell>
      <price-chart-component></price-chart-component>
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

const config = require('../../config.json')

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
      }
      //initialize canvas client
      canvas.initialize('ogp');
    }
  },
  computed: {
    account() {
      return this.$store.getters['account/account']
    },
    asset() {
      return this.$store.getters['asset/asset']
    }
  },
  methods: {
    async order_v1() {
      const address = this.account.address
      const params = this.$route.params
      const asset = this.asset.mchh
      const amount = document.getElementById('amount').value
      const wei = client.utils.toWei(amount)
      const approved = await client.contract.mchh.methods
        .isApprovedForAll(address, client.contract.bazaaar_v1._address)
        .call()
      if (approved) {
        canvas.draw(template, asset, amount)
        const salt = Math.floor(Math.random() * 1000000000)
        const order = {
          proxy: client.contract.bazaaar_v1._address,
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
        order.metadata = asset;
        console.log(order)
        console.log("api:post")
        const response = await this.$axios.post(config.api.bazaaar.v1, order)
        if(response.data.status){
          window.location.href = config.bazaaar.host + 'order/' + hash
        }
      } else {
        client.contract.mchh.methods
          .setApprovalForAll(client.contract.bazaaar_v1._address, true)
          .send({ from: this.account.address })
      }
    }
  }
}
</script>
