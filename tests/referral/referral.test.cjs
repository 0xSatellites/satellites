const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const Module = require('node:module')
const { execFileSync } = require('node:child_process')
const root = path.resolve(__dirname, '../..')
const dependencies = Module.createRequire(path.join(process.env.REFERRAL_TEST_DEPS || __dirname, 'package.json'))
const ts = dependencies('typescript')
const BigNumber = dependencies('bignumber.js')
const Vue = dependencies('vue')
const Vuex = dependencies('vuex')
Vue.use(Vuex)
const baseline = process.env.BASELINE_REF
const cache = new Map()
function source(relative) {
  return baseline
    ? execFileSync('git', ['show', `${baseline}:${relative}`], { cwd: root, encoding: 'utf8' })
    : fs.readFileSync(path.join(root, relative), 'utf8')
}
function load(relative) {
  if (cache.has(relative)) return cache.get(relative)
  let text = source(relative)
  if (relative.endsWith('.vue')) text = text.match(/<script lang="ts">([\s\S]*?)<\/script>/)[1]
  const result = ts.transpileModule(text, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2018,
    experimentalDecorators: true, esModuleInterop: true, allowJs: true
  } })
  const instance = new Module(path.join(root, relative), module)
  instance.filename = path.join(root, relative)
  instance.require = spec => spec.startsWith('~/')
    ? load(`templates/${spec.slice(2)}.js`)
    : spec.startsWith('.')
      ? load(path.posix.normalize(path.posix.join(path.posix.dirname(relative), `${spec}.js`)))
      : dependencies(spec)
  instance._compile(result.outputText, instance.filename)
  cache.set(relative, instance.exports)
  return instance.exports
}
const address = digit => `0x${digit.repeat(40)}`
const platform = address('1'), owner = address('2'), referrer = address('3'), buyer = address('4')
const config = () => ({ feeBase: 10000, referralOwnerFeeIndex: 1, referralShareBps: 5000,
  feeDistribution: [{ recipient: platform, ratio: 100 }, { recipient: owner, ratio: 900 }], etherscan: 'https://example.invalid/tx/' })

if (!baseline) {
  const { normalizeReferrer, buildPurchaseFees } = load('templates/utils/referral.js')
  test('validates scalar nonzero referral addresses', () => {
    assert.equal(normalizeReferrer(referrer.toUpperCase()), referrer)
    for (const value of [null, [], [referrer], '', address('0'), 'https://example.test', '0x123']) assert.equal(normalizeReferrer(value), null)
  })
  test('splits only owner allocation with integer conservation beyond safe JS numbers', () => {
    for (const value of ['0', '1', '10012', '9007199254740993123456']) {
      const amount = new BigNumber(value), settings = config()
      const before = JSON.stringify(settings)
      const base = buildPurchaseFees(amount, settings, null, buyer)
      const result = buildPurchaseFees(amount, settings, referrer, buyer)
      const sum = entries => entries.reduce((a, b) => a.plus(b), new BigNumber(0))
      assert.equal(sum(base.fees).toFixed(), sum(result.fees).toFixed())
      assert.equal(base.fees[0].toFixed(), result.fees[0].toFixed())
      assert.ok(result.fees.every(fee => fee.isInteger() && !fee.isNegative()))
      assert.equal(JSON.stringify(settings), before)
      assert.equal(amount.toFixed(), value)
    }
    const result = buildPurchaseFees(new BigNumber(10012), config(), referrer, buyer)
    assert.deepEqual(result.fees.map(fee => fee.toFixed()), ['100', '451', '450'])
  })
  test('invalid, self and existing-recipient links do not redirect fees', () => {
    for (const referral of [null, ['bad'], address('0'), buyer, owner, platform]) {
      const result = buildPurchaseFees(new BigNumber(10000), config(), referral, buyer)
      assert.deepEqual(result.recipients, [platform, owner])
      assert.deepEqual(result.fees.map(fee => fee.toFixed()), ['100', '900'])
    }
  })
  test('rejects invalid configuration and supports zero/full owner share', () => {
    for (const change of [{ referralShareBps: -1 }, { referralShareBps: 10001 }, { referralOwnerFeeIndex: 0 }, { referralOwnerFeeIndex: 2 }]) {
      assert.throws(() => buildPurchaseFees(new BigNumber(10000), { ...config(), ...change }, referrer, buyer), /configuration/)
    }
    for (const share of [0, 10000]) {
      const result = buildPurchaseFees(new BigNumber(10000), { ...config(), referralShareBps: share }, referrer, buyer)
      assert.equal(result.fees.reduce((a, b) => a.plus(b), new BigNumber(0)).toFixed(), '1000')
    }
  })
  test('actual middleware and Vuex retain SPA referral and clear explicit bad links', () => {
    const module = load('templates/store/index.js')
    const store = new Vuex.Store({ state: module.state(), mutations: module.mutations })
    const middleware = load('templates/middleware/referral.js').default
    middleware({ route: { query: { ref: referrer } }, store })
    assert.equal(store.state.referrer, referrer)
    middleware({ route: { query: {} }, store })
    assert.equal(store.state.referrer, referrer)
    middleware({ route: { query: { ref: [referrer] } }, store })
    assert.equal(store.state.referrer, null)
    assert.equal(module.state().referrer, null)
  })
  test('actual operator defaults split the owner slot even when platform and owner addresses coincide', () => {
    const settings = load('templates/plugins/config.ts').config
    const routing = load('templates/nuxt.config.ts').default.router
    assert.ok(routing.middleware.includes('referral'))
    assert.equal(settings.feeDistribution[0].recipient, settings.feeDistribution[1].recipient)
    const result = buildPurchaseFees(new BigNumber(10012), settings, referrer, buyer)
    assert.equal(result.recipients[2], referrer)
    assert.deepEqual(result.fees.map(fee => fee.toFixed()), ['100', '451', '450'])
  })
}

test('actual Vue purchase method passes conserved referral fees to transaction boundary', async () => {
  const Buttons = load('templates/components/molecules/Buttons.vue').default
  const store = new Vuex.Store({ state: { address: buyer, referrer } })
  const order = { takerAssetAmount: new BigNumber(10012) }
  let call
  Vue.prototype.$config = config()
  Vue.prototype.$satellites = { buy: async (...args) => { call = args; return 'synthetic-transaction' } }
  const vm = new Buttons({ store, propsData: { asset: { order } } })
  await vm.executeBuy()
  assert.equal(call[0], buyer)
  assert.equal(call[1], order)
  assert.deepEqual(call[2], [platform, owner, referrer])
  assert.deepEqual(call[3].map(fee => fee.toFixed()), ['100', '451', '450'])
  assert.equal(vm.dialogKey, 6)
  vm.$destroy()
})
