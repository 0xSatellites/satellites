<template>
    <div>
      <section class="l-item">
        <div class="l-item__frame">
        <div>
        <div class="l-item__img">
          <img :src="asset.mche.image_url" alt="">
          </div>
        </div>
        <div>
        <div class="l-item__name">{{asset.mche.extension_type.name.ja }} / LV.{{asset.mche.attributes.lv }}</div>
        <div class="l-item__txt"># {{asset.mche.external_url.slice(-8) }}</div>
        <div class="l-item__txt">My Crypto Heores</div>

        <ul class="l-item__data">
        <li>
          <!-- todo rarity -->
          <span class="l-item__rarity l-item__rarity--5">★★★★★</span>
          {{asset.mche.attributes.rarity }}</li>
        </ul>
        <ul class="l-item__data">
        <li><strong>HP：</strong> {{asset.mche.attributes.hp }}</li>
        <li><strong>PHY：</strong> {{asset.mche.attributes.phy }}</li>
        <li><strong>INT：</strong> {{asset.mche.attributes.int }}</li>
        <li><strong>AGI：</strong> {{asset.mche.attributes.agi }}</li>
        </ul>
        <ul class="l-item__data">
        <li><span class="l-item__skill--type">Active</span>{{asset.mche.skill.name.ja }}</li>
        </ul>

        <v-form v-model="valid">
          <div class="l-item__action">

          <div class="l-item__action__price"><label><input type="text" v-model="price" id="amount"> ETH</label></div>
          <v-expansion-panel>
            <v-expansion-panel-content>
              <div slot="header">オプション設定</div>
              <v-card>
                <p>一言メッセージ</p>
                <div ><textarea name="" id="" cols="30" rows="10"></textarea></div>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <div class="l-item__action__btns" v-if="approved">
              <v-btn class="l-item__action__btn"
                :disabled="loading"
                color="success"
                large
                @click="approve"
              >
                承認する
                <v-progress-circular size=16 class="ma-2" v-if="loading"
                indeterminate
              ></v-progress-circular>
              </v-btn>
          </div>

          <div class="l-item__action__btns" v-if="true">
              <v-btn class="l-item__action__btn l-item__action__btn--type1 white_text"
                :disabled="!valid || loading"
                color="#3498db"
                large
                @click="order_v1"
              >
                出品する
                <v-progress-circular size=16 class="ma-2" v-if="loading"
                indeterminate
              ></v-progress-circular>
              </v-btn>
          </div>
            <div class="l-item__action__btns" v-else>
              <div class="l-item__action__btn l-item__action__btn--type1"
              :disabled="!valid || loading"
              @click="order_v1"
              >
              金額変更する
              <v-progress-circular size=16 class="ma-2" v-if="loading"
                indeterminate
              ></v-progress-circular>
              </div>
              <div class="l-item__action__btn l-item__action__btn--type2"
              :disabled="!valid || loading"
              @click="cancel"
              value="cancel"
              >
              キャンセルする
              <v-progress-circular size=16 class="ma-2" v-if="loading"
                indeterminate
              ></v-progress-circular>
              </div>
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
          </div>
        </v-form>
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

                <div class="l-modal__og">
                    <div id="modalImg">
                      <img  :src="ogp" alt=""  width="85%">
                    </div>
                </div>

                <div class="l-modal__txt">SNSに投稿しましょう</div>
                <div class="l-modal__btn">
                  <a :href="'https://twitter.com/share?url=https://bazaaar.io/mche/' + hash +
                  '&text=' + '出品されました！ '+ asset.mche.extension_type.name.ja  + '/ LV.' + asset.mche.attributes.lv +
                  '&hashtags=bazaaar, バザール, マイクリ'" class="twitter-share-button" data-size="large" data-show-count="false" target=”_blank”>
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
    priceChartComponent,
  },
  data() {
    return {
      modal: false,
      tokenOwner: false,
      hash: "",
      ogp: "",
      price: "",
      loading:false,
      valid: true,
      checkbox: false,
      approved: false,
      }
  },
  async asyncData({ store, params }) {
    const asset = await functions.call('metadata', {asset:'mche', id:params.id})
    store.dispatch('asset/setMche', asset)

  },
  mounted: async function() {
    const store = this.$store

    if (typeof web3 != 'undefined') {
      if (!client.account.address) {
        //initialize web3 client
        const account = await client.activate(web3.currentProvider)
        store.dispatch('account/setAccount', account)

        const order = await firestore.docs(
          'order', 'maker', '==', account.address,
          'id' , '==', this.$route.params.id,
          'status', '==', '出品中')
        order.sort((a, b) => {
          if (a.timestamp < b.timestamp) return 1;
          if (a.timestamp > b.timestamp) return -1;
          return 0;
        });
        const order1 = order.shift();
        console.log(order1)
        this.price = order1.price/1000000000000000000
        await store.dispatch('order/setOrder', order1)

        const approved = await client.contract.mche.methods
        .isApprovedForAll(account.address, client.contract.bazaaar_v1.options.address)
        .call({from:account.address})
        console.log(approved)
        this.approved = approved
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
      const router = this.$router
      this.modal = false
      router.push({ path: '/mche/' + this.hash})
    },
    async order_v1() {
      console.log('order_v1')
      this.loading = true
      const account = this.account
      const asset = this.asset.mche
      const params = this.$route.params
      const router = this.$router
      // const amount = document.getElementById('amount').value
      const amount = this.price
      const wei = client.utils.toWei(amount)
      const approved = await client.contract.mche.methods
        .isApprovedForAll(account.address, client.contract.bazaaar_v1.options.address)
        .call({from:account.address})
      if (approved) {
        console.log('approved')
        const nonce = await client.contract.bazaaar_v1.methods
          .nonce_(account.address, client.contract.mche.options.address, params.id)
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
          asset: client.contract.mche.options.address,
          id: params.id,
          price: wei,
          nonce:nonce,
          salt: salt,
          expiration:expiration,
          creatorRoyaltyRatio: 600,
          referralRatio:400
        }
        console.log("ok")
        const signedOrder = await client.signOrder(order)
        console.log(signedOrder)
        var result = await functions.call('order', signedOrder)
        console.log(result)
        this.hash = result.hash
        this.ogp = result.ogp
        this.loading = false
        this.modal = true
        // router.push({ path: '/order/' + result.hash})
      } else {
        console.log('not approved')
        client.contract.mche.methods
          .setApprovalForAll(client.contract.bazaaar_v1.options.address, true)
          .send({ from: account.address })
          .on('transactionHash', function(hash) {
            console.log(hash)
          })
      }
    },
    async approve(){
      client.contract.mche.methods
          .setApprovalForAll(client.contract.bazaaar_v1.options.address, true)
          .send({ from: account.address })
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
          ]
        )
        .send({ from: account.address })
        .on('transactionHash', function(hash) {
          console.log(hash)
        })
    }
  }
}
</script>
<style scoped>
.twitter-share-button {
text-decoration: none;
color: white;
}
</style>
