export const state = () => ({
  account: "",
})

export const getters = {
    account: state => state.account,
}

export const mutations = {

  clearAccount(state) {
    state.account = ""
  },

  setAccount(state, account) {
    state.account = account
  }

}

export const actions = {
  async clear({ state, commit }) {
    commit('clearAccount')
  },

  async setAccount({ state, commit }, account) {
    commit('setAccount', account)
  },
}