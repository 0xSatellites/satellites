export const state = () => ({
  mchh: [],
  mche: []
})

export const getters = {
  myitems: state => {
    const myitems = {
      mchh:state.mchh,
      mche:state.mche,
    }
    return myitems
  }
}

export const mutations = {
  setMchh(state, mchh) {
    state.mchh = mchh
  },
  setMche(state, mche) {
    state.mche = mche
  }
}

export const actions = {
  async setMchh({ state, commit }, mchh) {
    commit('setMchh', mchh)
  },
  async setMche({ state, commit }, mche) {
    commit('setMche', mche)
  }
}
