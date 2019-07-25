export const state = () => ({
  address: null
})

export const mutations = {
  address(state, address) {
    state.address = address
  }
}
