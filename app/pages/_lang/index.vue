<template>
<div>
    <section class="l-visual">
        <div class="l-visual__bg"><img src="~/assets/img/top_visual/bg_pc.png" alt="" class="u-obj--pc"><img src="~/assets/img/top_visual/bg_sp.png" alt="" class="u-obj--sp"></div>

        <div class="l-visual__txts">
        <h1 class="l-visual__txts__title"><img src="~/assets/img/top_visual/title_pc.png" alt="誰でもカンタン デジタルアセットの取引マッチングサービス - bazaaar.io" class="u-obj--pc"><img src="~/assets/img/top_visual/title_sp.png" alt="" class="u-obj--sp"></h1>
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
            <div>
            <nuxt-link :to="'/ck/' + order.id" class="c-card">
              <div class="c-card__img"><img :src="order.metadata.image_url" /></div>
              <div class="c-card__name">Gen.{{ order.metadata.generation }}</div>
              <div class="c-card__txt"># {{ order.id }}</div>
              <div class="c-card__txt">Crypto Kitties</div>
              <div class="c-card__eth">Ξ {{ order.price / 1000000000000000000}} ETH</div>
            </nuxt-link>
          </div>
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
                        v-bind:src="require('~/assets/img/original/CryptoKitties.png')"
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
                    <v-card class="partner">
                        <v-img
                        v-bind:src="require('~/assets/img/original/tokenpocket.png')"
                        aspect-ratio="1"
                        ></v-img>

                        <v-card-title primary-title>
                        <div class="text-box">
                            <h3 class="headline mb-0">TokenPocket</h3>
                        </div>
                        </v-card-title>            
                    </v-card>
                </a>
                </v-flex>
                <v-flex xs6 md3>
                <a href="https://www.go-wallet.app/">
                    <v-card class="partner">
                        <v-img
                        v-bind:src="require('~/assets/img/original/GoWallet.png')"
                        aspect-ratio="1"
                        ></v-img>

                        <v-card-title primary-title>
                        <div class="text-box">
                            <h3 class="headline mb-0">GO!WALLET</h3>
                        </div>
                        </v-card-title>            
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

export default {
  data() {
    return {
   
      }
  },
  head() {
    return { title: this.$t('meta.titile') }
  },

  async asyncData({ store, params }) {
      const order = await firestore.getLatestOrders(4)
      console.log(order)
      await store.dispatch('order/setOrder', order)

    //const order = await firestore.doc('order', params.hash)
    //await store.dispatch('order/setOrder', order)

    // const recommend2 = await firestore.docs('order','status', '==', '出品中', 'metadata.attributes.rarity' , '==', order.metadata.attributes.rarity, )
    // recommend2.sort((a, b) => {
    //       if (a.price < b.price) return -1;
    //       if (a.price > b.price) return 1;
    //       return 0;
    //     });
    // const recommend = recommend2.slice(0,4)
    // await store.dispatch('recommend/setRecommend', recommend)
  },

  computed: {
    
    orders() {
      return this.$store.getters['order/order']
    },
    
  },
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
