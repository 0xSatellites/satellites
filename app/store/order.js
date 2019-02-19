export const state = () => ({
  order: {},
  orders: []
})

export const getters = {
  order: state => state.order,
  orders: state => state.orders
}

export const mutations = {
  setOrder(state, order) {
    state.order = order
  },
  setOrders(state, orders) {
    state.orders = orders
  }
}

export const actions = {
  async setOrder({ state, commit }, order) {
    commit('setOrder', order)
  },
  async setOrders({ state, commit }, orders) {
    commit('setOrders', orders)
  }
}
