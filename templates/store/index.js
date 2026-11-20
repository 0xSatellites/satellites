export const state = () => ({
  address: null,
  referrer: null
})

export const mutations = {
  address(state, address) {
    state.address = address
  },
  referrer(state, referrer) {
    state.referrer = referrer
  }
}
