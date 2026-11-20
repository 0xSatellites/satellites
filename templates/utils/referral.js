const zeroAddress = '0x0000000000000000000000000000000000000000'

export function normalizeReferrer(value) {
  if (typeof value !== 'string' || !/^0x[0-9a-f]{40}$/i.test(value) || value.toLowerCase() === zeroAddress) {
    return null
  }
  return value.toLowerCase()
}

export function buildPurchaseFees(amount, config, referrer, buyer) {
  const recipients = config.feeDistribution.map(entry => entry.recipient)
  const fees = config.feeDistribution.map(entry => amount.times(entry.ratio).dividedBy(config.feeBase).integerValue(3))
  const address = normalizeReferrer(referrer)
  const share = config.referralShareBps
  const ownerIndex = config.referralOwnerFeeIndex
  if (!address || address === normalizeReferrer(buyer)) return { recipients, fees }
  if (recipients.some(recipient => recipient.toLowerCase() === address)) return { recipients, fees }
  if (!Number.isInteger(share) || share < 0 || share > 10000 || !Number.isInteger(ownerIndex) || ownerIndex < 1 || ownerIndex >= fees.length) {
    throw new Error('Invalid referral fee configuration')
  }
  // Split an already rounded owner allocation so buyer and platform fees cannot increase.
  const referralFee = fees[ownerIndex].times(share).dividedBy(10000).integerValue(3)
  if (referralFee.isZero()) return { recipients, fees }
  fees[ownerIndex] = fees[ownerIndex].minus(referralFee)
  recipients.push(address)
  fees.push(referralFee)
  return { recipients, fees }
}
