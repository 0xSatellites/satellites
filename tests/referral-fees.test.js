const assert = require('assert')

const {
  createReferralFeeDistribution,
  getReferralAddressFromRoute,
} = require('../templates/plugins/referral')

const ownerAddress = '0x1111111111111111111111111111111111111111'
const referrerAddress = '0x2222222222222222222222222222222222222222'

const baseDistribution = [
  {
    recipient: '0x0000000000000000000000000000000000000000',
    ratio: 100,
  },
  {
    recipient: ownerAddress,
    ratio: 900,
  },
]

function totalRatio(distribution) {
  return distribution.reduce((total, entry) => total + entry.ratio, 0)
}

assert.strictEqual(
  getReferralAddressFromRoute({ query: { ref: referrerAddress.toUpperCase() } }),
  referrerAddress
)

assert.strictEqual(
  getReferralAddressFromRoute({ query: { ref: 'not-an-address' } }),
  ''
)

const distribution = createReferralFeeDistribution(
  baseDistribution,
  referrerAddress,
  ownerAddress,
  250
)

assert.deepStrictEqual(baseDistribution[1], {
  recipient: ownerAddress,
  ratio: 900,
})
assert.strictEqual(totalRatio(distribution), totalRatio(baseDistribution))
assert.deepStrictEqual(distribution[1], {
  recipient: ownerAddress,
  ratio: 650,
})
assert.deepStrictEqual(distribution[2], {
  recipient: referrerAddress,
  ratio: 250,
})

assert.deepStrictEqual(
  createReferralFeeDistribution(
    baseDistribution,
    ownerAddress,
    ownerAddress,
    250
  ),
  baseDistribution
)

console.log('referral fee distribution tests passed')
