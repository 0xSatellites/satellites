export const state = () => ({
  oink: {},
  oinks: [],
})

export const getters = {
  oink: state => state.oink,
  oinks: state => state.oinks,
}

export const mutations = {
  setOink(state, oink) {
    state.oink = oink
  },
  setOinks(state, oinks) {
    state.oinks = oinks
  }
}

export const actions = {
  async setOink({ state, commit }, oink) {
    commit('setOink', oink)
  },
  async setOinks({ state, commit }, oinks) {
    commit('setOinks', oinks)
  }
}
