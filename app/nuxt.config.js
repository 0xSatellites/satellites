const pkg = require('./package')


module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
      { hid: 'og:site_name', property: 'og:site_name', content: pkg.name },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: 'https://bazaaar.io' },
      { hid: 'og:title', property: 'og:title', content: pkg.name },
      { hid: 'og:description', property: 'og:description', content: pkg.description },
      { hid: 'og:image', property: 'og:image', content: '' },
      { hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image'}
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    { src: '@/assets/style/style_main.scss', lang: 'scss' }
    // "@/assets/style/style.css",
    // "@/assets/style/style_sp.css"
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/i18n.js'
  ],
  vendor: [
    'vue-i18n'
  ],

  router: {
    middleware: 'i18n'
  },
  generate: {
    routes: ['/', '/ja']
  },

  /*
  ** Nuxt.js modules
  */

  modules: [
    '@nuxtjs/axios',
    //'@nuxtjs/pwa',
    '@nuxtjs/vuetify',
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  }
}
