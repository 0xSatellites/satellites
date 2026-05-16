const assert = require('assert')

const {
  DEFAULT_ASSETS_PER_PAGE,
  buildAssetPageUrl,
  getPageOffset,
  getVisiblePageLength,
  getOrderEntries,
  getPageItems
} = require('../templates/plugins/pagination')

assert.strictEqual(DEFAULT_ASSETS_PER_PAGE, 24)
assert.strictEqual(getPageOffset(1, 24), 0)
assert.strictEqual(getPageOffset(3, 24), 48)
assert.strictEqual(getPageOffset('bad', 24), 0)

assert.strictEqual(getVisiblePageLength(1, false), 1)
assert.strictEqual(getVisiblePageLength(1, true), 2)
assert.strictEqual(getVisiblePageLength(4, false), 4)

const url = buildAssetPageUrl('https://api.example/assets?owner=0xabc', 3, 10)
assert.strictEqual(url, 'https://api.example/assets?owner=0xabc&limit=10&offset=20')

const filteredUrl = buildAssetPageUrl('https://api.example/assets?asset_contract_addresses=0x1', 2, 5)
assert.strictEqual(filteredUrl, 'https://api.example/assets?asset_contract_addresses=0x1&limit=5&offset=5')

const refinedOrders = {
  '0xTokenA': {
    '2': { takerAssetAmount: 20 },
    '1': { takerAssetAmount: 10 }
  },
  '0xTokenB': {
    '9': { takerAssetAmount: 90 }
  }
}

assert.deepStrictEqual(getOrderEntries(refinedOrders), [
  { tokenAddress: '0xTokenA', tokenId: '1', order: refinedOrders['0xTokenA']['1'] },
  { tokenAddress: '0xTokenA', tokenId: '2', order: refinedOrders['0xTokenA']['2'] },
  { tokenAddress: '0xTokenB', tokenId: '9', order: refinedOrders['0xTokenB']['9'] }
])

assert.deepStrictEqual(getPageItems(['a', 'b', 'c', 'd'], 2, 2), ['c', 'd'])
assert.deepStrictEqual(getPageItems(['a', 'b', 'c', 'd'], 0, 2), ['a', 'b'])

console.log('pagination helper tests passed')
