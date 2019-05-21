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
    <Related></Related>
    <section class="c-index">
        <h2 class="c-index__title">{{ $t('index.topic') }}</h2>
         <nuxt-link to="/mrm/release" class="py-3 px-2"><img src="~/assets/img/maltine/maltinelogo.png" alt="" width="100%"></nuxt-link>
    </section>
    <section class="c-index">
        <h2 class="c-index__title">{{ $t('index.handlingAssets') }}</h2>
        <v-container grid-list-md align-center justify-space-between>
            <v-layout row wrap justify-center>
                <v-flex xs6 sm4>
                <a href="https://www.cryptokitties.co/" target="_blank">
                    <v-card class="ma-1">
                        <v-img
                        v-bind:src="require('~/assets/img/asset/CryptoKitties.png')"
                        aspect-ratio="1.2"
                        ></v-img>
                    </v-card>
                </a>
                </v-flex>
                <v-flex xs6 sm4>
                <a href="https://www.crypt-oink.io/" target="_blank">
                    <v-card class="ma-1">
                        <v-img
                        v-bind:src="require('~/assets/img/asset/Crypt_Oink.png')"
                        aspect-ratio="1.2"
                        ></v-img>
                    </v-card>
                </a>
                </v-flex>
                <v-flex xs6 sm4>
                <a href="https://www.mycryptoheroes.net/" target="_blank">
                    <v-card class="ma-1">
                        <v-img
                        v-bind:src="require('~/assets/img/asset/mch_logo.png')"
                        aspect-ratio="1.2"
                        contain
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
        <v-layout justify-center>
         <nuxt-link :to="'/'+lang+'/info'">{{ $t('index.readmore') }}</nuxt-link>
        </v-layout>
    </section>
    <section class="c-index">
        <h2 class="c-index__title">{{ $t('index.partners') }}</h2>
        <v-container grid-list-md align-center justify-space-between>
            <v-layout row wrap justify-center>
                <v-flex xs6 sm3>
                <a href="https://tokenpocket.jp/ja/" target="_blank">
                    <v-card class="ma-1 pa-2">
                        <v-img
                        v-bind:src="require('~/assets/img/partner/tokenpocket.png')"
                        aspect-ratio="1"
                        ></v-img>
                    </v-card>
                </a>
                </v-flex>
                <v-flex xs6 sm3>
                <a href="https://www.go-wallet.app/" target="_blank">
                    <v-card class="ma-1 pa-4">
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
                    <v-card class="ma-1">
                        <v-img
                        v-bind:src="require('~/assets/img/sns/Twitter_Logo_Blue.png')"
                        aspect-ratio="1"
                        ></v-img>
                    </v-card>
                </a>
                </v-flex>
                <v-flex xs4 sm2>
                <a href="mailto:bazaaar@block-base.co">
                    <v-card class="ma-1">
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
import info from '~/components/info'
import Related from '~/components/related'

export default {
  components: {
    info,
    Related
  },
  computed: {
    head() {
      return { title: this.$t('meta.title') }
    },
    lang() {
      return this.$store.state.i18n.locale
    },
  }
}
</script>

