<template>
  <section class="l-information">
    <div class="l-information__img">
      <img class="ogpimg" :src="order.ogp" />
    </div>
    <div class="l-information__frame" v-if="order.valid">
      <div class="l-information__name">
        {{ name }}
      </div>
      <div class="l-information__txt">#{{ order.id }}</div>
      <div class="l-information__txt">{{ $t('asset.' + assetType) }}</div>
      <div class="l-information__txt">{{ $t('hash.seller') }} : {{ order.maker }}</div>
      <div v-if="assetType == 'mchh'">
        <div class="l-information__txt" v-if="order.creatorRoyaltyRatio >= 300">{{ $t('hash.creator') }} : {{ order.creatorRoyaltyRecipient }}</div>
      </div>
      <ul class="l-information__data">
        <li><span class="l-information__rarity l-item__rarity--5" v-for="i in getRarity(order)" :key="i + '-rarity'">★</span></li>
      </ul>
      <ul class="l-information__data" v-if="assetType == 'mchh' || assetType == 'mche'">
        <li><strong>HP：</strong> {{ order.metadata.attributes.hp }}</li>
        <li><strong>PHY：</strong> {{ order.metadata.attributes.phy }}</li>
        <li><strong>INT：</strong> {{ order.metadata.attributes.int }}</li>
        <li><strong>AGI：</strong> {{ order.metadata.attributes.agi }}</li>
      </ul>
      <ul class="l-information__data" v-if="lang && assetType == 'mchh'">
        <li>
          <span class="l-item__skill--type">Active</span><b>{{ order.metadata.active_skill.name[lang] }}</b
          ><br />{{ order.metadata.active_skill.description[lang].effects[0] }}
        </li>
        <li>
          <span class="l-item__skill--type">Passive</span><b>{{ order.metadata.passive_skill.name[lang] }}</b
          ><br />{{ order.metadata.passive_skill.description[lang].effects[0] }}
        </li>
      </ul>
      <ul class="l-information__data" v-if="lang && assetType == 'mche'">
        <li>
          <span class="l-item__skill--type">Passive</span><b>{{ order.metadata.skill.name[lang] }}</b
          ><br />{{ order.metadata.skill.description[lang].effects[0] }}
        </li>
      </ul>
      <ul class="l-information__data">
        <li>
          <span class="l-information__name">Ξ {{ fromWei(order.price) }} ETH</span>
        </li>
      </ul>
      <v-form v-model="valid" class="center">
        <div class="checkbox_center">
          <v-checkbox class="center" v-model="checkbox" :rules="[v => !!v || '']" :label="$t('hash.agree')" required v-if="!owner(order.maker)"></v-checkbox>
        </div>
        <div class="l-information__action">
          <v-btn class="l-item__action__btn l-item__action__btn--type1 white_text" color="#3498db" large @click="purchase" :disabled="!checkbox || loading" value="purchase"
            >{{ $t('hash.purchase') }}
            <v-progress-circular size="16" class="ma-2" v-if="loading" indeterminate></v-progress-circular>
          </v-btn>
          <div v-if="order.valid">
            <a :href="twitterUrl" class="twitter-share-button" data-size="large" data-show-count="false" target="”_blank”">
              <v-icon class="mt-4" color="#3498db">fab fa-twitter</v-icon>
            </a>
          </div>
        </div>
      </v-form>
    </div>
    <related></related>
    <modal v-if="modal" v-on:closeModal="closeModal" v-on:transitionTop="transitionTop" :hash="hash" :modalNo="modalNo"></modal>
  </section>
</template>
<script>
import client from '~/plugins/ethereum-client'
import firestore from '~/plugins/firestore'
import lib from '~/plugins/lib'
import Modal from '~/components/modal'
import Related from '~/components/related'

const project = process.env.project
const config = require('../config.json')
const host = config.host[project]

export default {
  components: {
    Modal,
    Related
  },
  data() {
    return {
      loading: false,
      valid: true,
      checkbox: false,
      modal: false,
      modalNo: 4,
      hash: '',
      lang: '',
      // url: { type: '', hash: '', project: '' },
      name: ''
    }
  },
  mounted: async function() {
    const store = this.$store
    // this.url.type = this.assetType
    // this.url.hash = this.$nuxt.$route.params.hash
    // this.url.project = config.host[project]
    this.lang = store.state.i18n.locale
    var account
    if (typeof web3 != 'undefined') {
      if (!client.account.address) {
        //initialize web3 client
        if (window.ethereum) {
          account = await client.activate(ethereum)
        } else {
          account = await client.activate(web3.currentProvider)
        }
        store.dispatch('account/setAccount', account)
      }
    }
  },
  computed: {
    assetType() {
      const routeNames = this.$route.name.split('-')
      if (routeNames[0] == 'lang') return routeNames[1]
      else return routeNames[0]
    },
    twitterUrl() {
        const baseURL = 'https://twitter.com/share?url=' + host + this.assetType + '/order/' + this.order.hash + '&text=' + this.$t('hash.sell') + ' / '
        if(this.assetType == 'mchh') {
            return baseURL + this.order.metadata.attributes.hero_name + ' / Lv.' + this.order.metadata.attributes.lv + ' / ' + this.order.metadata.attributes.rarity + '&hashtags=bazaaar, バザー, MCH, マイクリ'
        } else if (this.assetType == 'mche'){
            return baseURL + this.order.metadata.attributes.extension_name + ' / Lv.' + this.order.metadata.attributes.lv + ' / ' + this.order.metadata.attributes.rarity + '&hashtags=bazaaar, バザー, MCH, マイクリ'
        } else if (this.assetType == 'ck'){
            return baseURL + this.order.metadata.name + '/ Gen.' + this.order.metadata.generation + '&hashtags=bazaaar, バザー, くりぷ豚'
        } else if (this.assetType == 'ctn'){
            return baseURL + this.order.metadata.name + '/ Gen.' + this.order.metadata.generation + '&hashtags=bazaaar, バザー, CryptoKitties'
        }
    },
    account() {
      return this.$store.getters['account/account']
    },
    order() {
      return this.$store.getters['order/order']
    },
  },
  methods: {
    coolDownIndexToSpeed(index) {
      return lib.coolDownIndexToSpeed(index)
    },
    getRarity(asset, type) {
      return lib.getRarity(asset, type)
    },
    fromWei(wei) {
      return client.utils.fromWei(wei)
    },
    async purchase() {
      try {
        this.loading = true
        const account = this.account
        const order = this.order

        await client.contract.bazaaar.methods
          .orderMatch_(
            [order.proxy, order.maker, order.taker, order.relayerRoyaltyRecipient, order.creatorRoyaltyRecipient, order.asset, order.maker],
            [order.id, order.price, order.nonce, order.salt, order.expiration, order.relayerRoyaltyRatio, order.creatorRoyaltyRatio, order.referralRatio],
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
          console.log(err)
        this.loading = false
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
      router.push({ path: '/' })
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
</style>