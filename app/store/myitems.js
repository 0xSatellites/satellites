export const state = () => ({
  mchh: [],
  mche: [],
  ck:[]
})

export const getters = {
  myitems: state => {
    const myitems = {
      mchh:state.mchh,
      mche:state.mche,
      ck:state.ck,
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
  },
  setCk(state, ck) {
    state.ck = ck
  }
}

export const actions = {
  async setMchh({ state, commit }, mchh) {
    commit('setMchh', mchh)
  },
  async setMche({ state, commit }, mche) {
    commit('setMche', mche)
  },
  async setCk({ state, commit }, ck) {
    commit('setCk', ck)
  },
}
