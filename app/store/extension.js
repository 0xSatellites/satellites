export const state = () => ({
    extension: {},
    extensions: [],
  })
  
  export const getters = {
    extension: state => state.extension,
    extensions: state => state.extensions,
  }
  
  export const mutations = {
    setExtension(state, extension) {
      state.extension = extension
    },
    setExtensions(state, extensions) {
      state.extensions = extensions
    }
  }
  
  export const actions = {
    async setExtension({ state, commit }, extension) {
      commit('setExtension', extension)
    },
    async setExtensions({ state, commit }, extensions) {
      commit('setExtensions', extensions)
    }
  }
  