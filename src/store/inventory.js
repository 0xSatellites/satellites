import axios from 'axios'

export const state = () => ({
  inventory: [],
  balance: 0,
  breakpoint: 0
})

export const getters = {
    inventory: state => state.inventory,
    balance: state => state.balance,
    breakpoint : state => state.breakpoint
}

export const mutations = {

  clearInventory(state) {
    state.inventory = []
  },

  setInventory(state, inventory) {
    state.inventory = inventory
  },

  pushInventory(state, inventory) {
    state.inventory = state.inventory.concat(inventory)
  },

  setBalance(state, balance) {
    state.balance = balance
  },

  setBreakpoint(state, breakpoint) {
    state.breakpoint = breakpoint
  },

}

export const actions = {

  async clear({ state, commit }) {
    commit('clearInventory')
  },

  async initial({ state, commit }, address) {
    var response = await axios.get(process.env.API + "inventory/ownedTokens?address="  + address + "&from=0");
    commit('setInventory', response.data)
  },

  async load({ state, commit }, param) {
    var response = await axios.get(process.env.API + "inventory/ownedTokens?address=" + param.address + "&from=" + param.from);
    commit('pushInventory', response.data)
  },

  async detail({ state, commit }, id) {
    var response = await axios.get(process.env.API + "inventory/token?id=" + id);
    commit('setInventory', response.data)
  },

  async balance({ state, commit }, address) {
    var response = await axios.get(process.env.API + "inventory/balance?address=" + address);
    commit('setBalance', response.data)
  },

  async breakpoint({ state, commit }, address) {
    var response = await axios.get(process.env.API + "inventory/breakpoint?address=" + address);
    commit('setBreakpoint', response.data)
  },

}
