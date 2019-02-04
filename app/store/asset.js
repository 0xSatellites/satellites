export const state = () => ({
  //MCH
  mchh: {},
  mche: {}
})

export const getters = {
  asset: state => {
    const asset = {
      mchh:state.mchh,
      mche:state.mche,
    }
    return asset
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
