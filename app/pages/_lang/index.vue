<template>
<div>
    <section class="l-visual">
        <div class="l-visual__bg"><img src="~/assets/img/top_visual/bg_pc.png" alt="" class="u-obj--pc"><img src="~/assets/img/top_visual/bg_sp.png" alt="" class="u-obj--sp"></div>

        <div class="l-visual__txts">
          <h1 class="l-visual__txts__title u-obj--pc" >{{ $t('index.title1') }}{{ $t('index.title2') }}</h1>
          <h1 class="l-visual__txts__title u-obj--sp pl-4" v-if="$i18n.locale === 'en'" >{{ $t('index.title1') }}<br>{{ $t('index.title2') }}</h1>
          <h1 class="l-visual__txts__title u-obj--sp pa-4" v-if="$i18n.locale === 'ja'" >{{ $t('index.title1') }}{{ $t('index.title2') }}</h1>

          <h2 class="l-visual__txts__tagline pa-1">{{ $t('index.tagline') }}<br><span class="bazaaar">Bazaaar.io</span></h2>
        </div>

        <div class="l-visual__img"><img src="~/assets/img/top_visual/illust.png" alt=""></div>

        <div class="l-about">
        <ul>
        <li>
        <h2 class="l-about__title">{{ $t('index.subTitle1') }}</h2>
        <p class="l-about__txt">{{ $t('index.subDiscription1') }}</p>
        </li>
        <li>
        <h2 class="l-about__title">{{ $t('index.subTitle2') }}</h2>
        <p class="l-about__txt">{{ $t('index.subDiscription2') }}</p>
        </li>
        <li>
        <h2 class="l-about__title">{{ $t('index.subTitle3') }}</h2>
        <p class="l-about__txt">{{ $t('index.subDiscription3') }}</p>
        </li>
        </ul>
        </div>
    </section>
    <section class="c-index c-index--recommend">

        <h2 class="c-index__title">{{ $t('index.newAssets') }}</h2>
        <ul>
        <li v-for="(order, i) in orders" :key="i + '-ck'">
            <nuxt-link v-if="order.asset === ck" :to="$t('index.holdLanguageCK') + order.hash" class="c-card">
              <div class="c-card__label c-card__label__rarity--5"><span v-for="(i) in getRarity(order.metadata)" :key="i + '-rarity'">★</span></div>
              <div class="c-card__img"><img :src="order.metadata.image_url" /></div>
              <div class="c-card__name" v-if="order.metadata.name">{{ order.metadata.name.substring(0,25) }}</div>
              <div class="c-card__name" v-else>Gonbee</div>
              <div class="c-card__txt"># {{ order.id }}</div>
              <div class="c-card__txt">Gen {{order.metadata.generation}} : {{coolDownIndexToSpeed(order.metadata.status.cooldown_index)}}</div>
              <div class="c-card__eth">Ξ {{ fromWei(order.price) }} ETH</div>
            </nuxt-link>
            <nuxt-link v-else-if="order.asset === ctn" :to="$t('index.holdLanguageCTN') + order.hash" class="c-card">
              <div class="c-card__label c-card__label__rarity--5"><span v-for="(i) in getRarity(order.metadata)" :key="i + '-rarity'">★</span></div>
              <div class="c-card__img"><img :src="order.metadata.image_url" /></div>
              <div class="c-card__name" v-if="order.metadata.name">{{ order.metadata.name.substring(0,25) }}</div>
              <div class="c-card__name" v-else>Gonbee</div>
              <div class="c-card__txt"># {{ order.id }}</div>
              <div class="c-card__txt">Gen {{order.metadata.generation}} : {{coolDownIndexToSpeed(Number(order.metadata.status.cooldown_index))}}</div>
              <div class="c-card__eth">Ξ {{ fromWei(order.price) }} ETH</div>
            </nuxt-link>
            <nuxt-link v-else-if="order.asset === mchh" :to="$t('index.holdLanguageMCHH') + order.hash" class="c-card">
              <div class="c-card__label c-card__label__rarity--5"><span v-for="(i) in getRarity(order.metadata)" :key="i + '-rarity'">★</span></div>
              <div class="c-card__img"><img :src="order.metadata.image_url" /></div>
              <div class="c-card__name" v-if="order.metadata.name">{{ order.metadata.name.substring(0,25) }}</div>
              <div class="c-card__name" v-else>Gonbee</div>
              <div class="c-card__txt"># {{ order.id }}</div>
              <div class="c-card__eth">Ξ {{ fromWei(order.price) }} ETH</div>
            </nuxt-link>
            <nuxt-link v-else-if="order.asset === mche" :to="$t('index.holdLanguageMCHE') + order.hash" class="c-card">
              <div class="c-card__label c-card__label__rarity--5"><span v-for="(i) in getRarity(order.metadata)" :key="i + '-rarity'">★</span></div>
              <div class="c-card__img"><img :src="order.metadata.image_url" /></div>
              <div class="c-card__name" v-if="order.metadata.name">{{ order.metadata.name.substring(0,25) }}</div>
              <div class="c-card__name" v-else>Gonbee</div>
              <div class="c-card__txt"># {{ order.id }}</div>
              <div class="c-card__eth">Ξ {{ fromWei(order.price) }} ETH</div>
            </nuxt-link>
        </li>
        </ul>
    </section>
    <section class="c-index">
        <h2 class="c-index__title">{{ $t('index.handlingAssets') }}</h2>
        <v-container grid-list-md align-center justify-space-between>
            <v-layout row wrap justify-center>
                <v-flex xs6 sm4>
                <a href="https://www.cryptokitties.co/" target="_blank">
                    <v-card>
                        <v-img
                        v-bind:src="require('~/assets/img/asset/CryptoKitties.png')"
                        aspect-ratio="1.2"
                        ></v-img>
                    </v-card>
                </a>
                </v-flex>
                <v-flex xs6 sm4>
                <a href="https://www.crypt-oink.io/" target="_blank">
                    <v-card>
                        <v-img
                        v-bind:src="require('~/assets/img/asset/Crypt_Oink.png')"
                        aspect-ratio="1.2"
                        ></v-img>
                    </v-card>
                </a>
                </v-flex>
            </v-layout>
        </v-container>
    </section>
    <section class="c-index">
        <h2 class="c-index__title">{{ $t('index.tweet') }}</h2>
        <v-container grid-list-md align-center>
            <v-layout justify-center>
                <a class="twitter-timeline" data-width="420" data-height="600" data-theme="light" data-link-color="#2B7BB9" href="https://twitter.com/bazaaario?ref_src=twsrc%5Etfw">Tweets by bazaaario</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
            </v-layout>
        </v-container>
    </section>
    <section class="c-index">
        <h2 class="c-index__title">{{ $t('index.info') }}</h2>
        <info></info>
    </section>
    <section class="c-index">
        <h2 class="c-index__title">{{ $t('index.partners') }}</h2>
        <v-container grid-list-md align-center justify-space-between>
            <v-layout row wrap justify-center>
                <v-flex xs6 sm3>
                <a href="https://tokenpocket.jp/ja/" target="_blank">
                    <v-card class="partner pa-3">
                        <v-img
                        v-bind:src="require('~/assets/img/partner/tokenpocket.png')"
                        aspect-ratio="1"
                        ></v-img>
                    </v-card>
                </a>
                </v-flex>
                <v-flex xs6 sm3>
                <a href="https://www.go-wallet.app/" target="_blank">
                    <v-card class="partner pa-3">
                        <v-img
                        v-bind:src="require('~/assets/img/partner/GoWallet.png')"
                        aspect-ratio="1"
                        ></v-img>
                    </v-card>
                </a>
                </v-flex>
            </v-layout>
        </v-container>
    </section>
    <section class="c-index">
        <h2 class="c-index__title">{{ $t('index.contact') }}</h2>
        <v-layout justify-center>
            <p>{{ $t('index.contactText') }}</p>
        </v-layout>
        <v-container grid-list-md align-center justify-space-between>
            <v-layout row wrap justify-center>
                <v-flex xs4 sm2>
                <a href="https://twitter.com/bazaaario" target="_blank">
                    <v-card class="partner">
                        <v-img
                        v-bind:src="require('~/assets/img/sns/Twitter_Logo_Blue.png')"
                        aspect-ratio="1"
                        ></v-img>
                    </v-card>
                </a>
                </v-flex>
                <v-flex xs4 sm2>
                <a href="mailto:bazaaar@block-base.co">
                    <v-card class="partner">
                        <v-img
                        v-bind:src="require('~/assets/img/sns/Gmail_Logo.png')"
                        aspect-ratio="1"
                        ></v-img>
                    </v-card>
                </a>
                </v-flex>
            </v-layout>
        </v-container>
    </section>
</div>
</template>

<script>

import firestore from '~/plugins/firestore'
import client from '~/plugins/ethereum-client'
import kitty from '~/plugins/kitty'
import oink from '~/plugins/oink'
import info from '~/components/info'


const config = require('../../config.json')
const project = process.env.project
const ck = config.contract[project].ck
const ctn = config.contract[project].ctn
const mchh = config.contract[project].mchh
const mche = config.contract[project].mche


export default {
  data() {
    return {
        ck,
        ctn,
        mchh,
        mche
      }
  },
  components: {
    info
  },
  head() {
    return { title: this.$t('meta.title') }
  },

  async asyncData({ store, params }) {
      const orders = await firestore.getLatestValidOrders(4)
      await store.dispatch('order/setOrders', orders)
  },
  computed: {
    orders() {
      return this.$store.getters['order/orders']
    },
  },
  methods: {
    coolDownIndexToSpeed(index) {
      return kitty.coolDownIndexToSpeed(index)
    },
    getRarity(asset) {
      return kitty.getRarity(asset)
    },
    coolDownIndexToSpeed(index) {
      return oink.coolDownIndexToSpeed(index)
    },
    getRarity(asset) {
      return oink.getRarity(asset)
    },
    fromWei(wei) {
        return client.utils.fromWei(wei)
    }
  }
}

</script>

<style scope>
    .text-box{
        margin: auto;
    }

    .partner{
        margin-right: 1em;
    }
</style>
