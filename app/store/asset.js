export const state = () => ({
  asset: {},
  assets: [],
})

export const getters = {
  asset: state => state.asset,
  assets: state => state.assets,
}

export const mutations = {
  setAsset(state, asset) {
    state.asset = asset
  },
  setAssets(state, assets) {
    state.assets = assets
  }
}

export const actions = {
  async setAsset({ state, commit }, asset) {
    commit('setAsset', asset)
  },
  async setAssets({ state, commit }, assets) {
    commit('setAssets', assets)
  }
}
