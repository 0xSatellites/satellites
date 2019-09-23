import NuxtConfiguration from '@nuxt/config'

const nuxtConfig: NuxtConfiguration = {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Satellites, the satellites NFT market place.' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'Satellites' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: '' },
      { hid: 'og:title', property: 'og:title', content: 'Satellites' },
      { hid: 'og:description', property: 'og:description', content: 'Satellites, the satellites NFT market place.' },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://ipfs.io/ipfs/QmQ5ryYFY7oQnE2meQhGvLE9BmYWzke79ZT4ZeFkm3JakT'
      },
      { hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' }
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
  plugins: ['@/plugins/initialize.ts',
    { src: '@/plugins/ga.js', ssr: false },
    '@/plugins/vue-paginate.ts'],
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
  axios: {
    retry: { retries: 3 }
  },
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
  manifest: {
    background_color: '#fff',
    theme_color: '#3498db'
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
