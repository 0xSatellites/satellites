<template>
    <header class="l-header">
        <div class="l-header__logo">
        <nuxt-link :to="'/'+lang">
            <img src="~/assets/img/header/logo_pc.svg" alt="bazaaar.io" class="u-obj--pc">
        <img src="~/assets/img/header/logo_sp.svg" alt="" class="u-obj--sp">
        </nuxt-link>
        </div>
        <nav class="l-header__nav">
          <ul>
            <li>
              <nuxt-link :to="'/'+lang+'/myitems'" class="py-3 px-2">{{$t('header.mypage')}}</nuxt-link>
              <nuxt-link :to="'/'+lang+'/market'" class="py-3 px-2">{{$t('header.market')}}</nuxt-link>
              <NuxtLink v-if="$i18n.locale === 'ja' && $route.fullPath === '/en/'" :to="`/en`" class="ml-2"><img src="~/assets/img/country/japan.png"/></NuxtLink>
              <NuxtLink v-else-if="$i18n.locale === 'ja' && $route.fullPath.match(/en/)" :to="$route.fullPath" class="ml-2"><img src="~/assets/img/country/japan.png"/></NuxtLink>
              <NuxtLink v-else-if="$i18n.locale === 'ja'" :to="`/en` + $route.fullPath" class="ml-2"><img src="~/assets/img/country/japan.png"/></NuxtLink>
              <NuxtLink v-else :to="$route.fullPath.replace('/en', '')" class="ml-2"><img src="~/assets/img/country/english.png"/></NuxtLink>
              <!-- <NuxtLink v-if="isLogin" :to="$t('header.mypageHD')"><img :src="twitterAccount.photoURL"></NuxtLink> -->
            </li>
          </ul>

        </nav>
    </header>
</template>

<script>
import firebase from 'firebase'

export default {
  mounted: async function() {
    
    firebase.auth().onAuthStateChanged(twitterAccount =>{
      if (twitterAccount) {
        this.isLogin = true
      } else {
        this.isLogin = false
      };
    })
  },
  data() {
      return {
        isLogin: false,
      }
    },

  computed: {
    lang() {
      return this.$store.state.i18n.locale
    },
  }
}
</script>