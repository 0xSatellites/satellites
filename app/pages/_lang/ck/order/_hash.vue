<template>
<div>
    <section class="l-information">
      <div ><img class="ogpimg" :src="order.ogp" width=100%></div>
      <div class="l-information__frame" v-if="order.valid">
        <div class="l-information__name">{{ order.metadata.name}} / Gen.{{ order.metadata.generation}}</div>
        <div class="l-information__txt"># {{ order.metadata.id}}</div>
        <div class="l-information__txt">Crypto Kitties</div>
        <v-form v-model="valid">
        <div class="l-information__action">
          <v-btn v-if="order.status == '出品中'"
          class="l-information__action__btn"
          :disabled="!valid || loading"
          color="#3498db"
          large
          @click="purchase"
          value="purchase"
          >購入する
           <v-progress-circular size=16 class="ma-2" v-if="loading"
              indeterminate
            ></v-progress-circular>
          </v-btn>
      </div>
       <v-flex center>
            <v-checkbox
              class="center"
              v-model="checkbox"
              :rules="[v => !!v || '']"
              label="利用規約に同意する"
              required
            ></v-checkbox>
        </v-flex>
        </v-form>
    </div>
    <div class="l-information__action__btn" v-if="order.valid">
       <a :href="'https://twitter.com/share?url=https://bazaaar.io/ck/order/' + order.hash +
        '&text=' + '出品されました! '+ order.metadata.name  + '/ Gen.' + order.metadata.generation +
        '&hashtags=bazaaar, バザール, CryptoKitties'" class="twitter-share-button" data-size="large" data-show-count="false" target=”_blank”>
        Tweetする
        </a>
        <!-- <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> -->
    </div>
    </section>
    <section class="c-index c-index--recommend">
        <h2 class="c-index__title">関連アセット</h2>
        <ul>
        <li v-for="(recommend, i ) in recommend" :key="i">
        <nuxt-link :to="'/order/'+ recommend.id" class="c-card">
        <div class="c-card__img"><img :src="recommend.metadata.image_url" alt=""></div>
        <div class="c-card__name">{{recommend.metadata.name}}</div>
        <div class="c-card__txt">#{{recommend.id}}</div>
        <div class="c-card__eth">{{recommend.price / 1000000000000000000}} ETH</div>
        </nuxt-link>
        </li>
        </ul>
    </section>
    <div>

    </div>
    <transition name="modal" v-if="modal">
        <div class="l-modal">

            <div class="l-modal__frame">

                <div class="l-modal__icon"><img src="~/assets/img/modal/icon.svg" alt=""></div>
                <div class="l-modal__title">購入処理が完了しました！</div>

                <div class="l-modal__og">
                    <div id="modalImg">
                      <img  :src="order.ogp" alt=""  width="85%">
                    </div>
                </div>
                <div class="l-modal__txt">トランザクションハッシュ</div>
                <div class="l-modal__txt"><nuxt-link :to="'https://etherscan.io/tx/' + hash">Ethescan</nuxt-link></div>

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

const config = require('../../../../config.json')

export default {

  head() {
    var order = this.order
    return {
      meta:
      [{ hid: 'og:image', property: 'og:image', content: order.ogp }]
    }
  },
  data() {
    return {
      loading:false,
      valid: true,
      checkbox: false,
      modal: false,
      hash: "",
      }
  },
  async asyncData({ store, params }) {
    const order = await firestore.doc('order', params.hash)
    await store.dispatch('order/setOrder', order)

    const recommend = await firestore.getRelatedValidOrders(params.hash, order.maker, order.id)
    await store.dispatch('order/setOrders', recommend)

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
    },
    recommend(){
      return this.$store.getters['order/orders']
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
            order.creatorRoyaltyRecipient,
            order.asset,
            order.maker
          ],
          [
            order.id,
            order.price,
            order.nonce,
            order.salt,
            order.expiration,
            order.creatorRoyaltyRatio,
            order.referralRatio
          ],
          order.v,
          order.r,
          order.s,
        )
        .send({ from: account.address, value: order.price })
        .on('transactionHash', function(hash) {
          console.log(hash)
          this.hash = hash
          this.modal = true
        })
    },
    openModal() {
      this.modal = true
    },
    closeModal() {
      this.modal = false
    },
  }
}
</script>
<style scoped>
.twitter-share-button {
text-decoration: none;
color: white;
}

.share{
  max-width: 100px;
  text-align: center;
  padding: 10px 0;
  margin: auto;
}
.ogpimg{

}
</style>

