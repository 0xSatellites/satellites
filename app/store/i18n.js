export const state = () => ({
    sidebar: false,
    locales: ['en', 'ja'],
    locale: 'ja'
  })

  export const mutations = {
    toggleSidebar (state) {
      state.sidebar = !state.sidebar
    },
    SET_LANG (state, locale) {
      if (state.locales.indexOf(locale) !== -1) {
        state.locale = locale
      }
    }
  }