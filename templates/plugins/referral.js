const ethereumAddressPattern = /^0x[a-fA-F0-9]{40}$/

function normalizeAddress(address) {
  if (typeof address !== 'string') {
    return ''
  }

  const normalized = address.trim().toLowerCase()
  return ethereumAddressPattern.test(normalized) ? normalized : ''
}

function getReferralAddressFromRoute(route) {
  const ref = route && route.query && route.query.ref
  const value = Array.isArray(ref) ? ref[0] : ref

  return normalizeAddress(value)
}

function createReferralFeeDistribution(feeDistribution, referrerAddress, ownerAddress, referralFeeRatio) {
  const entries = Array.isArray(feeDistribution) ? feeDistribution.slice() : []
  const normalizedReferrerAddress = normalizeAddress(referrerAddress)
  const normalizedOwnerAddress = normalizeAddress(ownerAddress)
  const referralRatio = Number(referralFeeRatio)

  if (
    !normalizedReferrerAddress ||
    !normalizedOwnerAddress ||
    normalizedReferrerAddress === normalizedOwnerAddress ||
    !Number.isFinite(referralRatio) ||
    referralRatio <= 0
  ) {
    return entries
  }

  let referrerApplied = false
  const redistributedEntries = entries.map((entry) => {
    const recipient = normalizeAddress(entry.recipient)
    const ratio = Number(entry.ratio)

    if (!referrerApplied && recipient === normalizedOwnerAddress && ratio > referralRatio) {
      referrerApplied = true
      return {
        ...entry,
        ratio: ratio - referralRatio,
      }
    }

    return entry
  })

  if (!referrerApplied) {
    return entries
  }

  return [
    ...redistributedEntries,
    {
      recipient: normalizedReferrerAddress,
      ratio: referralRatio,
    },
  ]
}

module.exports = {
  createReferralFeeDistribution,
  getReferralAddressFromRoute,
}
