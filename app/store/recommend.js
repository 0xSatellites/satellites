export const state = () => ({
    recommend: {}
  })

  export const getters = {
    recommend: state => state.recommend
  }

  export const mutations = {
    setRecommend(state, recommend) {
      state.recommend = recommend
    }
  }

  export const actions = {
    async setRecommend({ state, commit }, recommend) {
      commit('setRecommend', recommend)
    }
  }
