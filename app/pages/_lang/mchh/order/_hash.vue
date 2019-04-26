<template>
  <div>
    <section class="l-information" v-if="order.asset === mchh">
      <div class="l-information__img">
        <img class="ogpimg" :src="order.ogp" />
      </div>
      <div class="l-information__frame" v-if="order.valid">
        <div class="l-information__name">
          {{ order.metadata.attributes.hero_name }}
        </div>
        <div class="l-information__txt">#{{ order.id }}</div>
        <div class="l-information__txt">{{$t('assets.mch')}}</div>
        <div class="l-information__txt">{{$t('hash.seller')}} : {{ order.maker }}</div>
        <div class="l-information__txt" v-if="order.creatorRoyaltyRatio>=300">{{$t('hash.creator')}} : {{ order.creatorRoyaltyRecipient }}</div>
        <ul class="l-information__data">
          <li><span class="l-information__rarity l-item__rarity--5" v-for="(i) in getRarity(order)" :key="i + '-rarity'">★</span></li>
        </ul>
        <ul class="l-information__data">
          <li><strong>HP：</strong> {{order.metadata.attributes.hp }}</li>
          <li><strong>PHY：</strong> {{order.metadata.attributes.phy }}</li>
          <li><strong>INT：</strong> {{order.metadata.attributes.int }}</li>
          <li><strong>AGI：</strong> {{order.metadata.attributes.agi }}</li>
        </ul>
        <ul class="l-information__data" v-if="lang === 'ja'">
            <!-- TODO 条件分岐 Active有無 -->
          <li><span class="l-item__skill--type">Active</span><b>{{order.metadata.active_skill.name.ja}}</b><br>{{order.metadata.active_skill.description.ja.effects[0]}}<br>{{order.metadata.active_skill.description.ja.effects[1]}}</li>
          <li><span class="l-item__skill--type">Passive</span><b>{{order.metadata.passive_skill.name.ja}}</b><br>{{order.metadata.passive_skill.description.ja.effects[0]}}<br>{{order.metadata.passive_skill.description.ja.effects[1]}}</li>
        </ul>
        <ul class="l-information__data" v-else-if="lang === 'en'">
            <!-- TODO 条件分岐 Active有無 -->
          <li><span class="l-item__skill--type">Active</span><b>{{order.metadata.active_skill.name.en}}</b><br>{{order.metadata.active_skill.description.en.effects[0]}}<br>{{order.metadata.active_skill.description.en.effects[1]}}</li>
          <li><span class="l-item__skill--type">Passive</span><b>{{order.metadata.passive_skill.name.en}}</b><br>{{order.metadata.passive_skill.description.en.effects[0]}}<br>{{order.metadata.passive_skill.description.en.effects[1]}}</li>
        </ul>
        <ul class="l-information__data">
          <li><span class="l-information__name">Ξ {{ fromWei(order.price) }} ETH</span></li>
        </ul>
        <v-form v-model="valid" class="center">
          <div class="checkbox_center">
          <v-checkbox
            class="center"
            v-model="checkbox"
            :rules="[v => !!v || '']"
            :label="$t('hash.agree')"
            required
            v-if="!owner(order.maker)"
          ></v-checkbox>
          </div>
          <div class="l-information__action">
            <v-btn
              class="l-item__action__btn l-item__action__btn--type1 white_text"
              color="#3498db"
              large
              @click="purchase"
              :disabled="!checkbox || loading"
              value="purchase"
              >{{$t('hash.purchase')}}
              <v-progress-circular
                size="16"
                class="ma-2"
                v-if="loading"
                indeterminate
              ></v-progress-circular>
            </v-btn>
            <div v-if="order.valid">
              <a
                :href="
                  'https://twitter.com/share?url=' +
                    host +
                    type.symbol +
                  '/order/' +
                    order.hash +
                    '&text=' +
                    $t('hash.sell') +
                    ' / ' +
                    order.metadata.attributes.hero_name  +
                    ' / Lv.' +
                    order.metadata.attributes.lv +
                    ' / ' +
                    order.metadata.attributes.rarity +
                    '&hashtags=bazaaar, バザール, MCH, マイクリ'

                "
                class="twitter-share-button"
                data-size="large"
                data-show-count="false"
                target="”_blank”"
              >
                <v-icon class="mt-4" color="#3498db">fab fa-twitter</v-icon>
              </a>
            </div>
          </div>
        </v-form>
      </div>
    </section>
   <section class="c-index c-index--recommend mt-5" v-if="recommend.length">
      <h2 class="c-index__title">{{$t('hash.relatedAsset')}}</h2>
      <related
        :recommend="recommend"
      ></related>
    </section>
    <div></div>
    <modal
      v-if="modal"
      v-on:closeModal="closeModal"
      v-on:transitionTop="transitionTop"
      :hash="hash"
      :modalNo="modalNo"
      :url="url"
    ></modal>
  </div>
</template>

<script>
import client from '~/plugins/ethereum-client'
import firestore from '~/plugins/firestore'
import Modal from '~/components/modal'
import common from '~/plugins/common'
import hero from '~/plugins/hero'
import Related from '~/components/related'

import '@fortawesome/fontawesome-free/css/all.css'

const project = process.env.project
const config = require('../../../../config.json')
const host = config.host[project]
const mchh = config.contract[project].mchh

export default {
  components: {
    Modal,
    Related
  },

  head() {
    var order = this.order
    return {
      meta: [
        { hid: 'og:title', property: 'og:title', content: this.$t('meta.title') },
        { hid: 'og:description', property: 'og:description', content: this.$t('meta.description')  },
        { hid: 'og:image', property: 'og:image', content: order.ogp }
        ]
    }
  },
  data() {
    return {
      loading: false,
      valid: true,
      checkbox: false,
      modal: false,
      modalNo: 4,
      hash: '',
      host,
      mchh,
      type: { name: 'マイクリ', symbol: 'mchh'},
      url: {type: 'mchh', hash: '', project: ''},
      lang: ''
    }
  },

  async asyncData({ store, params, error }) {
    try {
      const order = await firestore.doc('order', params.hash)
      await store.dispatch('order/setOrder', order)
      const recommend = await firestore.getRelatedValidOrders(
        params.hash,
        order.maker,
        order.id
      )
      await store.dispatch('order/setOrders', recommend)
    } catch(err){
      error({ statusCode: 404, message: 'Post not found' })
    }

  },
  mounted: async function() {
    const store = this.$store
    var account
    if (typeof web3 != 'undefined') {
      if (!client.account.address) {
        //initialize web3 client
        if(window.ethereum){
          account = await client.activate(ethereum)
        } else {
          account = await client.activate(web3.currentProvider)
        }
        store.dispatch('account/setAccount', account)
      }
    }
    this.url.hash = this.$nuxt.$route.params.hash
    this.url.project = config.host[project]
    this.lang = store.state.i18n.locale
  },
  computed: {
    account() {
      return this.$store.getters['account/account']
    },
    order() {
      return this.$store.getters['order/order']
    },
    recommend() {
      return this.$store.getters['order/orders']
    }
  },
  methods: {
    coolDownIndexToSpeed(index) {
      return common.coolDownIndexToSpeed(index)
    },
    getRarity(asset) {
        return common.getRarity(asset)
    },
    getHeroRarity(asset) {
      return hero.getHeroRarity(asset)
    },
    fromWei(wei) {
        return client.utils.fromWei(wei)
    },
    async purchase() {
      try{
        this.loading = true
        const account = this.account
        const order = this.order

        await client.contract.bazaaar_v3.methods
          .orderMatch_(
            [
              order.proxy,
              order.maker,
              order.taker,
              order.creatorRoyaltyRecipient,
              order.asset,
              config.recipient[project].mch_distributer
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
            order.s
          )
          .send({ from: account.address, value: order.price })
          .on('transactionHash', hash => {
            this.hash = hash
            this.modal = true
            this.loading = false
          })
        } catch (err) {
        this.loading = false;
        this.modalNo = 6
        this.modal = true
        }
    },
    closeModal() {
      this.modal = false
    },
    transitionTop() {
      const router = this.$router
      this.modal = false
      router.push({ path: '/'})
    },
    owner(maker) {
      return maker == this.account.address
    }
  }
}
</script>
<style scoped>
.twitter-share-button {
  text-decoration: none;
  color: white;
}

.share {
  max-width: 100px;
  text-align: center;
  padding: 10px 0;
  margin: auto;
}

.white_text {
  color: white;
}

.v-input__control {
  margin: 0 auto;
}
</style>
