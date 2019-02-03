<template>
    <div>
      <section class="l-item">
        <div class="l-item__frame">
        <div>
        <div class="l-item__img">
          <img :src="asset.mchh.image_url" alt="">
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
import client from '~/plugins/ethereum-client'
import firestore from '~/plugins/firestore'
import functions from '~/plugins/functions'
import priceChartComponent from '~/components/pricechart'

const config = require('../../config.json')

export default {
  components: {
    priceChartComponent
  },
  async asyncData({ store, params }) {
    const asset = await functions.call('metadata', {asset:'mchh', id:params.id})
    store.dispatch('asset/setMchh', asset)
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
    asset() {
      return this.$store.getters['asset/asset']
    }
  },
  methods: {
    async order_v1() {
      console.log('order_v1')
      const account = this.account
      const asset = this.asset.mchh
      const params = this.$route.params
      const router = this.$router
      const amount = document.getElementById('amount').value
      const wei = client.utils.toWei(amount)
      const approved = await client.contract.mchh.methods
        .isApprovedForAll(account.address, client.contract.bazaaar_v1.options.address)
        .call({from:account.address})
      if (approved) {
        console.log('approved')
        const nonce = await client.contract.bazaaar_v1.methods
          .nonce_(account.address, client.contract.mchh.options.address, params.id)
          .call({from:account.address})
        const salt = Math.floor(Math.random() * 1000000000)
        const date = new Date()
        date.setDate(date.getDate() + 7)
        const expiration = Math.round(date.getTime() / 1000)
        const order = {
          proxy: client.contract.bazaaar_v1.options.address,
          maker: account.address,
          taker: config.constant.nulladdress,
          creatorRoyaltyRecipient: account.address,
          asset: client.contract.mchh.options.address,
          id: params.id,
          price: wei,
          nonce:nonce,
          salt: salt,
          expiration:expiration,
          creatorRoyaltyRatio: 600,
          referralRatio:400
        }
        const signedOrder = await client.signOrder(order)
        var result = await functions.call('order', signedOrder)
        router.push({ path: '/order/' + result.hash})
      } else {
        console.log('not approved')
        client.contract.mchh.methods
          .setApprovalForAll(client.contract.bazaaar_v1.options.address, true)
          .send({ from: account.address })
          .on('transactionHash', function(hash) {
            console.log(hash)
          })
      }
    }
  }
}
</script>
