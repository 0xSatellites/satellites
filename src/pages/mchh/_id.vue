<template>
    <div>
      <p>{{asset}}</p>
      <div><img :src="asset.mchh.cache_image" width="200"></div>
      <input type="text" id="amount">
      <input type ="button" @click="order_v1" value=Sell>
      <line-chart :chart-data="datacollection"></line-chart>
      <canvas id="ogp" width="1200" height="630" hidden></canvas>
    </div>
</template>

<script>
import db from '~/plugins/db'
import canvas from '~/plugins/canvas'
import LineChart from '~/plugins/chart'
import client from '~/plugins/ethereum-client'
import storage from '~/plugins/storage'
import template from '~/assets/ogp_template.svg'

const config = require('../../config.json')

export default {
  components: {
    LineChart
  },
  data () {
    return {
      datacollection: null
    }
  },
  async asyncData({ store, params }) {
    const asset = await db.getAssetByKey('mchh_' + params.id)
    await store.dispatch('asset/setMchh', asset)
  },
  mounted: async function() {
    const store = this.$store
    const prams = this.$route.params
    const asset = this.asset.mchh
    console.log(asset)
    if (typeof web3 != 'undefined') {
      if (!client.account.address) {
        //initialize web3 client
        const account = await client.activate(web3.currentProvider)
        store.dispatch('account/setAccount', account)
      }
      //initialize canvas client
      canvas.initialize('ogp');
    }
    //chart
    const history = await db.getPastOrderByType(prams.id.substring(0,4))
    this.datacollection = {
      labels: history.labels,
      datasets: [
        {
          label: asset.attributes.hero_name,
          data: history.total_prices
        }
      ]
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
      const id = this.$route.params.id
      const asset = this.asset
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
          id: id,
          price: wei,
          artEditRoyaltyRatio: 600,
          salt: salt
        }
        const data = client.utils.soliditySha3(
          order.proxy,
          order.maker,
          order.taker,
          order.artEditRoyaltyRecipient,
          order.id,
          order.price,
          order.artEditRoyaltyRatio,
          order.salt
        )
        const sig = await client.eth.personal.sign(data, address)

        order.r = sig.substring(0, 66)
        order.s = '0x' + sig.substring(66, 130)
        order.v = '0x' + sig.substring(130, 132)

        const hash = await client.contract.bazaaar_v1.methods
          .requireValidOrder_(
            [order.proxy, order.maker, order.taker, order.artEditRoyaltyRecipient],
            [order.id, order.price, order.artEditRoyaltyRatio, order.salt],
            order.v,
            order.r,
            order.s
          )
          .call()
        const base64 = canvas.generate().substr(22)
        order.ogp = await storage.ogp(hash, base64)
        console.log("api:post")
        const response = await this.$axios.post(config.api.bazaaar.v1, order)
        console.log(response)
      } else {
        client.contract.mchh.methods
          .setApprovalForAll(client.contract.bazaaar_v1._address, true)
          .send({ from: this.account.address })
      }
    }
  }
}
</script>
