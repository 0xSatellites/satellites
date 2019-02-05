<template>
  <div>
    <header-temp></header-temp>
    <nuxt />
    <footer-temp></footer-temp>
  </div>
</template>
<script>
import HeaderTemp from '~/components/header'
import FooterTemp from '~/components/footer'

export default {
  components: {
    HeaderTemp,
    FooterTemp
  },
}
</script>
<style>
</style>
