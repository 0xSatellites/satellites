export const DEFAULT_ASSETS_PER_PAGE: number

export function buildAssetPageUrl(baseUrl: string, page: number, perPage: number): string

export function getPageOffset(page: number, perPage: number): number

export function getVisiblePageLength(page: number, hasNextPage: boolean): number

export function getOrderEntries(refinedOrders: any): any[]

export function getPageItems(items: any[], page: number, perPage: number): any[]
