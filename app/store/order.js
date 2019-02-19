export const state = () => ({
  order: []
})

export const getters = {
  order: state => state.order
}

export const mutations = {
  setOrder(state, order) {
    state.order = order
  }
}

export const actions = {
  async setOrder({ state, commit }, order) {
    commit('setOrder', order)
  }
}
