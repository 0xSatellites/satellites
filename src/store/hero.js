import axios from 'axios'
import contract from '~/assets/js/contract';

export const state = () => ({
  heroes: []
})

export const getters = {
    heroes: state => state.heroes
}

export const mutations = {
  setHeroes(state, heroes) {
    state.heroes = heroes
  }
}

export const actions = {
  async bazaar({ state, commit }) {

    commit('setHeroes', metadata)    

  }

}
