<template>
    <div @click="generate">
      <p>{{asset}}</p>
      <div><img :src="asset.mchh.cache_image" width="200"></div>
      <input type="text" id="amount">
      <input type ="button" @click="order_v1" value=Sell>
      <canvas crossOrigin = 'anonymous' id="ogp" width="1200" height="630" hidden></canvas>
    </div>
</template>

<script>

  import client from '~/plugins/ethereum-client'
  import db from '~/plugins/db'
  import storage from '~/plugins/storage'
  import canvas from '~/plugins/canvas'
  import template from '~/assets/ogp_template.svg'

  const config = require('../../config.json')

  export default {

    data: function () {
      return {
      }
    },

    async asyncData({ store, params }) {
      const asset = await db.getAssetByKey('mchh_' + params.id)
      await store.dispatch('asset/setMchh', asset)
    },

    mounted: async function() {
      canvas.draw('ogp', template, this.asset)
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

      async generate(){
        const base64 = canvas.generate('generate', template, this.asset).substr(22)
        storage.ogp("test", base64)
      },

      async order_v1() {
        const address = this.account.address
        const id = this.$route.params.id
        const amount = document.getElementById('amount').value
        const wei = client.utils.toWei(amount)
        const approved = await client.contract.mchh.methods.isApprovedForAll(address, client.contract.bazaaar_v1._address).call()
        if(approved){
          const salt = Math.floor(Math.random() * 1000000000);
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
          );
          const sig = await client.eth.personal.sign(data, address);

          order.r = sig.substring(0,66)
          order.s = "0x" + sig.substring(66,130)
          order.v = "0x" + sig.substring(130,132)

          const hash = await client.contract.bazaaar_v1.methods.requireValidOrder_([
              order.proxy,
              order.maker,
              order.taker,
              order.artEditRoyaltyRecipient,
          ], [
              order.id,
              order.price,
              order.artEditRoyaltyRatio,
              order.salt
          ],  order.v,
              order.r,
              order.s
          ).call()

          await this.$axios.post(config.api.bazaaar.v1, order)

        } else {
          client.contract.mchh.methods.setApprovalForAll(client.contract.bazaaar_v1._address, true).send({from:this.account.address})
        }

      }
    }

  }

</script>
