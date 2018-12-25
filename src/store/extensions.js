import axios from 'axios'

export const state = () => ({
  extensions: [],
  balance: 0
})

export const getters = {
    extensions: state => state.extensions,
    balance: state => state.balance
}

export const mutations = {

  clearExtensions(state) {
    state.extensions = []
  },

  setExtensions(state, extensions) {
    state.extensions = extensions
  },

  pushExtensions(state, extensions) {
    state.extensions = state.extensions.concat(extensions)
  },

  setBalance(state, balance) {
    state.balance = balance
  },  

}

export const actions = {

  async clear({ state, commit }) {
    commit('clearExtensions')    
  },

  async initial({ state, commit }, from) {
    var response = await axios.get(process.env.API + "extension/ownedTokens?address=0xaA64dd8e189b067A82Ea66C523CdDA19F6f0E9e3&from=" + from);
    commit('setExtensions', response.data)    
  },

  async load({ state, commit }, from) {
    var response = await axios.get(process.env.API + "extension/ownedTokens?address=0xaA64dd8e189b067A82Ea66C523CdDA19F6f0E9e3&from=" + from);
    commit('pushExtensions', response.data)    
  },  

  async detail({ state, commit }, id) {
    var response = await axios.get(process.env.API + "extension/token?id=" + id);
    commit('setExtensions', response.data)    
  },

  async balance({ state, commit }) {
    var response = await axios.get(process.env.API + "extension/balance?address=0xaA64dd8e189b067A82Ea66C523CdDA19F6f0E9e3");
    commit('setBalance', response.data)    
  },  


}
