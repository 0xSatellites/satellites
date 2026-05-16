const DEFAULT_ASSETS_PER_PAGE = 24

function normalizePage(page) {
  const parsed = parseInt(page, 10)
  return isFinite(parsed) && parsed > 0 ? parsed : 1
}

function normalizePerPage(perPage) {
  const parsed = parseInt(perPage, 10)
  return isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_ASSETS_PER_PAGE
}

function getPageOffset(page, perPage) {
  return (normalizePage(page) - 1) * normalizePerPage(perPage)
}

function buildAssetPageUrl(baseUrl, page, perPage) {
  const separator = baseUrl.indexOf('?') === -1 ? '?' : '&'
  return `${baseUrl}${separator}limit=${normalizePerPage(perPage)}&offset=${getPageOffset(page, perPage)}`
}

function getVisiblePageLength(page, hasNextPage) {
  const currentPage = normalizePage(page)
  return hasNextPage ? currentPage + 1 : currentPage
}

function getOrderEntries(refinedOrders) {
  const entries = []
  for (const tokenAddress in refinedOrders) {
    for (const tokenId in refinedOrders[tokenAddress]) {
      entries.push({
        tokenAddress,
        tokenId,
        order: refinedOrders[tokenAddress][tokenId]
      })
    }
  }
  return entries
}

function getPageItems(items, page, perPage) {
  const offset = getPageOffset(page, perPage)
  return items.slice(offset, offset + normalizePerPage(perPage))
}

module.exports = {
  DEFAULT_ASSETS_PER_PAGE,
  buildAssetPageUrl,
  getPageOffset,
  getVisiblePageLength,
  getOrderEntries,
  getPageItems
}
