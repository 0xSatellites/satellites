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
  head() {
    var order = this.order
    return {
      meta: [
        { title: this.$t('meta.title') },
        { description: this.$t('meta.description') },
        { hid: 'og:title', property: 'og:title', content: this.$t('meta.title') },
        { hid: 'og:description', property: 'og:description', content: this.$t('meta.description')  },
         { hid: 'og:image', property: 'og:image', content: this.$t('meta.image') }
        ]
    }
  },
}
</script>
