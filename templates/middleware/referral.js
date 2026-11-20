import { normalizeReferrer } from '../utils/referral'

export default function({ route, store }) {
  if (Object.prototype.hasOwnProperty.call(route.query, 'ref')) {
    store.commit('referrer', normalizeReferrer(route.query.ref))
  }
}
