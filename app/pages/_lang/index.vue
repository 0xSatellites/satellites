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
            <nuxt-link :to="$t('index.holdLanguage') + order.hash" class="c-card">
              <div class="c-card__label c-card__label__rarity--5"><span v-for="(i) in getRarity(order.metadata)" :key="i + '-rarity'">★</span></div>
              <div class="c-card__img"><img :src="order.metadata.image_url" /></div>
              <div class="c-card__name" v-if="order.metadata.name">{{ order.metadata.name.substring(0,25) }}</div>
              <div class="c-card__name" v-else>Gonbee</div>
              <div class="c-card__txt"># {{ order.id }}</div>
              <div class="c-card__txt">Gen {{order.metadata.generation}} : {{coolDownIndexToSpeed(order.metadata.status.cooldown_index)}}</div>
              <div class="c-card__eth">Ξ {{ fromWei(order.price) }} ETH</div>
            </nuxt-link>
        </li>
        </ul>
    </section>
    <section class="c-index">
        <h2 class="c-index__title">{{ $t('index.handlingAssets') }}</h2>
            <v-layout>
                <v-flex xs12 sm6 offset-sm3>
                <a href="https://www.cryptokitties.co/">
                    <v-card>
                        <v-img
                        v-bind:src="require('~/assets/img/asset/CryptoKitties.png')"
                        aspect-ratio="1.75"
                        ></v-img>

                        <v-card-title primary-title>
                        <div class="text-box">
                            <h3 class="headline mb-0">CryptoKitties</h3>
                        </div>
                        </v-card-title>
                    </v-card>
                </a>
                </v-flex>
            </v-layout>
    </section>
    <section class="c-index">
        <h2 class="c-index__title">{{ $t('index.partners') }}</h2>
        <v-container grid-list-md align-center justify-space-between>
            <v-layout row wrap justify-center>
                <v-flex xs6 md3>
                <a href="https://tokenpocket.jp/ja/">
                    <v-card class="partner pa-3">
                        <v-img
                        v-bind:src="require('~/assets/img/partner/tokenpocket.png')"
                        aspect-ratio="1"
                        ></v-img>
                    </v-card>
                </a>
                </v-flex>
                <v-flex xs6 md3>
                <a href="https://www.go-wallet.app/">
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
</div>
</template>

<script>

import firestore from '~/plugins/firestore'
import client from '~/plugins/ethereum-client'
import kitty from '~/plugins/kitty'

export default {
  data() {
    return {
      }
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

    a{
        text-decoration: none
    }

    .partner{
        margin-right: 1em;
    }
</style>
