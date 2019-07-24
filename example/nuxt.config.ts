import NuxtConfiguration from '@nuxt/config'

const nuxtConfig: NuxtConfiguration = {
  mode: 'spa',

  env: {
    NETWORK_ID: process.env.NETWORK_ID || '4',
    RELAYER: process.env.RELAYER || 'https://relayer.ookimaki.com/v2/',
  },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Bazaaar.io, the 0x satellites NFT market place.' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'Bazaaar.io' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: 'https://bazaaar.io' },
      { hid: 'og:title', property: 'og:title', content: 'Bazaaar.io' },
      { hid: 'og:description', property: 'og:description', content: 'Bazaaar.io, the 0x satellites NFT market place.' },
      { hid: 'og:image', property: 'og:image', content: 'https://ipfs.io/ipfs/QmQP7vu6piKFCT9CKrN7NyNZL3P2sw9E6pR4sRnFx2gWWc' },
      { hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image'}
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/initialize.ts',
    { src: '@/plugins/ga.js', ssr: false }
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/vuetify',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    theme: {
      primary: '#3498db',
      secondary: '#575656',
      accent: '#dbcb34'
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    //  extend(config, ctx) {}
  }
}
export default nuxtConfig
