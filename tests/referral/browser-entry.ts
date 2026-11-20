import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import BigNumber from 'bignumber.js'
import Buttons from '../../templates/components/molecules/Buttons.vue'
import referral from '../../templates/middleware/referral'
import { state, mutations } from '../../templates/store'
import { config } from '../../templates/plugins/config'

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(Vuetify)
Vue.config.productionTip = false
const store = new Vuex.Store({ state: state(), mutations })
store.commit('address', '0x4444444444444444444444444444444444444444')
const router = new VueRouter({ mode: 'history', routes: [{ path: '/market' }, { path: '/asset' }] })
router.beforeEach((to, from, next) => {
  referral({ route: to, store })
  next()
})
const calls: any[] = []
;(Vue.prototype as any).$config = { ...config, etherscan: 'https://example.invalid/tx/' }
;(Vue.prototype as any).$satellites = {
  buy: async (buyer, order, recipients, fees) => {
    calls.push({ buyer, recipients, fees: fees.map(fee => fee.toFixed()) })
    return 'synthetic-transaction'
  }
}
const asset = {
  owner: { address: '0x5555555555555555555555555555555555555555' },
  order: { takerAssetAmount: new BigNumber('10012') }
}
new Vue({
  store,
  router,
  render: h => h('v-app', [h('main', { style: { padding: '24px', maxWidth: '800px', margin: 'auto' } }, [
    h('h1', 'Marketplace'),
    h('router-link', { props: { to: '/asset' } }, 'Asset'),
    h(Buttons, { props: { asset } })
  ])])
}).$mount('#app')
;(window as any).referralEvidence = { store, calls }
