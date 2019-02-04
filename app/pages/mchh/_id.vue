<template>
    <div>
      <section class="l-item">
        <div class="l-item__frame">
        <div>
        <div class="l-item__img">
<<<<<<< HEAD
          <img :src="asset.mchh.cache_image" alt="">
          <!-- アートエディット作者に許可が必要なため、掲載しない -->
          <!-- <img src="https://ipfs.infura.io/ipfs/QmTauj6WRifc3fXowFRgs27U7HSmSMNbvEdPzQqDZ9ERwB" alt=""> -->
=======
          <img :src="asset.mchh.image_url" alt="">
          <img src="https://ipfs.infura.io/ipfs/QmTauj6WRifc3fXowFRgs27U7HSmSMNbvEdPzQqDZ9ERwB" alt="">
>>>>>>> 14b336f064f4be3bff2c2e5746c235e0e3ba840e
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
        <li><span class="l-item__skill--type">Active</span>{{asset.mchh.attributes.active_skill }}</li>
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
        <button @click="openModal">開く</button>
      </div>
      </div>
      </section>
      <section class="c-price">
        <h2 class="c-price__title">価格推移</h2>
        <price-chart-component></price-chart-component>
      </section>
      <canvas id="ogp" width="1200" height="630" hidden></canvas>

      <transition name="modal" v-if="modal">
        <div class="l-modal">

            <div class="l-modal__frame">

                <div class="l-modal__icon"><img src="~/assets/img/modal/icon.svg" alt=""></div>
                <div class="l-modal__title">出品されました！</div>

                <div class="l-modal__og"><canvas id="modalImg" width="1200" height="630"></canvas></div>

                <div class="l-modal__txt">SNSに投稿しましょう</div>
                <div class="l-modal__btn">
                  <a :href="'https://twitter.com/share?url=https://bazaaar.io' +
                  '&text=' + '出品されました'+ asset.mchh.attributes.hero_name  + '/ LV.' + asset.mchh.attributes.lv +
                  '&hashtags=bazaaar, マイクリ'" class="twitter-share-button" data-size="large" data-show-count="false" target=”_blank”>
                  twitterに投稿
                  </a>
                </div>

                <div class="l-modal__close" @click="closeModal">
                  <div class="l-modal__close__icon" ></div>
                  <div class="l-modal__close__txt u-obj--sp">閉じる</div>
                </div>

            </div>

        </div>
      </transition>
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
    PriceChartComponent,
  },
  data() {
    return {
      modal: false,
    }

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


        const order = await db.getOrderByHistory(account)
        await store.dispatch('order/setOrder', order)
      }
    }
  },
  computed: {
    account() {
      return this.$store.getters['account/account']
    },
    asset() {
      return this.$store.getters['asset/asset']
    },
    order() {
      return this.$store.getters['order/order']
    }
  },
  methods: {
    openModal() {
      this.modal = true
    },
    closeModal() {
      this.modal = false
    },
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
<style scoped>
a {
text-decoration: none;
color: white;
}

</style>
