const pkg = require('./package')

module.exports = {
  mode: 'universal',

  env: {
    project: process.env.NODE_ENV || 'development'
  },

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
      { hid: 'og:image', property: 'og:image', content: 'https://firebasestorage.googleapis.com/v0/b/blockbase-bazaaar-sand.appspot.com/o/og%2Fogp_jp.png?alt=media&token=bfcdcc0a-eeda-4fa8-b1f8-1cab1ee65e37' },
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
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/i18n.js',
    { src: '~plugins/ga.js', ssr: true }
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
    'nuxt-maintenance-mode'
  ],
  maintenance: {
    enabled: !!process.env.MAINTENANCE_MODE, // If given truthy value, activation maintenance mode on startup your nuxt application.
    path: '/maintenance', // maintenance fallback content routing.
    // matcher: /^\/admin/ // Path to be in maintenance mode (regex).
  },
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
