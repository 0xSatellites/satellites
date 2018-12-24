import axios from 'axios'

export const state = () => ({
  extension: {},
  balance: 0
})

export const getters = {
    extension: state => state.extension,
    balance: state => state.balance
}

export const mutations = {

  clearExtension(state) {
    state.extension = {}
  },

  setExtension(state, extension) {
    state.extension = extension
  }

}

export const actions = {

  async clear({ state, commit }) {
    commit('clearExtension')    
  },

  async detail({ state, commit }, id) {
    var response = await axios.get(process.env.API + "extension/token?id=" + id);
    commit('setExtension', response.data)    
  },

}