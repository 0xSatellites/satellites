export const state = () => ({
  hero: {},
  heros: [],
})

export const getters = {
  hero: state => state.hero,
  heros: state => state.heros,
}

export const mutations = {
  setHero(state, hero) {
    state.hero = hero
  },
  setHeros(state, heros) {
    state.heros = heros
  }
}

export const actions = {
  async setHero({ state, commit }, hero) {
    commit('setHero', hero)
  },
  async setHeros({ state, commit }, heros) {
    commit('setHeros', heros)
  }
}
