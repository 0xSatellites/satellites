import axios from 'axios'

export const state = () => ({
  heroes: [],
  balance: 0
})

export const getters = {
    heroes: state => state.heroes,
    balance: state => state.balance
}

export const mutations = {

  clearHeroes(state) {
    state.heroes = []
  },

  setHeroes(state, heroes) {
    state.heroes = heroes
  },

  pushHeroes(state, heroes) {
    state.heroes = state.heroes.concat(heroes)
  },

  setBalance(state, balance) {
    state.balance = balance
  },  

}

export const actions = {

  async clear({ state, commit }) {
    commit('clearHeroes')    
  },

  async initial({ state, commit }, from) {
    var response = await axios.get(process.env.API + "hero/ownedTokens?address=0x08dd65737605b29e24f18981b4e0c5552c8eb224&from=" + from);
    commit('setHeroes', response.data)    
  },

  async load({ state, commit }, from) {
    console.log("load:" + from)
    var response = await axios.get(process.env.API + "hero/ownedTokens?address=0x08dd65737605b29e24f18981b4e0c5552c8eb224&from=" + from);
    commit('pushHeroes', response.data)    
  },  

  async detail({ state, commit }, id) {
    var response = await axios.get(process.env.API + "hero/token?id=" + id);
    commit('setHeroes', response.data)    
  },

  async balance({ state, commit }) {
    var response = await axios.get(process.env.API + "hero/balance?address=0x08dd65737605b29e24f18981b4e0c5552c8eb224");
    commit('setBalance', response.data)    
  },  


}
