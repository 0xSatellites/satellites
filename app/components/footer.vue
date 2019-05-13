<template>

<footer class="l-footer">
    <div class="l-footer__company">
    <small>&copy; 2019 BlockBase Co.,Ltd.</small>
        <div>
        <a href="https://block-base.co/" target="_blank">{{$t('footer.company')}}</a>｜
        <nuxt-link :to="'/'+lang+'/terms'">{{$t('footer.terms')}}</nuxt-link>｜
        <nuxt-link :to="'/'+lang+'/info'">{{$t('footer.info')}}</nuxt-link>｜
        <a href="https://twitter.com/bazaaario" target="_blank">{{$t('footer.contact')}}</a>
        </div>
    </div>
</footer>
</template>

<script>
export default {
  computed: {
    lang() {
      return this.$store.state.i18n.locale
    },
  }
}
</script>

<style>

</style>
