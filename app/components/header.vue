<template>
    <header class="l-header">
        <div class="l-header__logo">
        <nuxt-link to="/">
            <img src="~/assets/img/header/logo_pc.svg" alt="bazaaar.io" class="u-obj--pc">
        <img src="~/assets/img/header/logo_sp.svg" alt="" class="u-obj--sp">
        </nuxt-link>
        </div>
        <nav class="l-header__nav">
        <!-- <ul>
        <li v-for="(item, i) in items" :key="i"><nuxt-link :to="item.to">{{item.title}}</nuxt-link></li>
        </ul> -->
        <ul>
        <li>
        <nuxt-link :to="'/myitems'">{{$t('header.mypage')}}</nuxt-link>
        <nuxt-link :to="'/myitems'">{{$t('header.howto')}}</nuxt-link>
         <NuxtLink v-if="$i18n.locale === 'en'" :to="`/ja` + $route.fullPath" class="Header__Link" active-class="none" exact>
            {{ $t('header.japanese') }}
          </NuxtLink>
          <NuxtLink v-else :to="$route.fullPath.replace(/^\/[^\/]+/, '')" class="Header__Link" active-class="none" exact>
            {{ $t('header.english') }}
          </NuxtLink></li>
          </ul>
        </nav>
    </header>
</template>

<script>
export default {
    data() {
    return {
      drawer: false,
      items: [
        { title: 'マイページ', to: '/myitems' },
        { title: '使い方', to: '/howto' }
      ],
      title: 'bazaar.io'
    }
  },

}
</script>

<style>

</style>
