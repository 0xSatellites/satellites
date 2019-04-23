<template>
    <header class="l-header">
        <div class="l-header__logo">
        <nuxt-link :to="$t('header.topHD')">
            <img src="~/assets/img/header/logo_pc.svg" alt="bazaaar.io" class="u-obj--pc">
        <img src="~/assets/img/header/logo_sp.svg" alt="" class="u-obj--sp">
        </nuxt-link>
        </div>
        <nav class="l-header__nav">
          <ul>
            <li>
              <nuxt-link :to="$t('header.mypageHD')" class="py-3 px-2">{{$t('header.mypage')}}</nuxt-link>
              <nuxt-link :to="$t('header.marketHD')" class="py-3 px-2">{{$t('header.market')}}</nuxt-link>

              <!-- <nuxt-link :to="'/myitems'" class="pa-1">{{$t('header.howto')}}</nuxt-link> -->
              <NuxtLink v-if="$i18n.locale === 'ja' && $route.fullPath === '/en/'" :to="`/en`" class="ml-2"><img src="~/assets/img/country/english.png"/></NuxtLink>
              <NuxtLink v-else-if="$i18n.locale === 'ja' && $route.fullPath.match(/en/)" :to="$route.fullPath" class="ml-2"><img src="~/assets/img/country/english.png"/></NuxtLink>
              <NuxtLink v-else-if="$i18n.locale === 'ja'" :to="`/en` + $route.fullPath" class="ml-2"><img src="~/assets/img/country/english.png"/></NuxtLink>
              <NuxtLink v-else :to="$route.fullPath.replace('/en', '')" class="ml-2"><img src="~/assets/img/country/japan.png"/></NuxtLink>
            </li>
          </ul>

        </nav>
    </header>
</template>
