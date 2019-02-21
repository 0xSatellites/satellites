<template>
  <div>
    <header class="l-header">
        <div class="l-header__logo">
          <nuxt-link to="/">
              <img src="~/assets/img/header/logo_pc.svg" alt="bazaaar.io" class="u-obj--pc">
          <img src="~/assets/img/header/logo_sp.svg" alt="" class="u-obj--sp">
          </nuxt-link>
        </div>
    </header>
    <nuxt />
    <footer-temp></footer-temp>
  </div>
</template>
<script>
import FooterTemp from '~/components/footer'

export default {
  components: {
    FooterTemp
  },
}
</script>
