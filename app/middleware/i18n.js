export default function ({ isHMR, app, store, route, params, error, redirect }) {
    const defaultLocale = app.i18n.fallbackLocale
    // If middleware is called from hot module replacement, ignore it
    if (isHMR) return
    // Get locale from params
    const locale = params.lang || defaultLocale

    if (store.state.i18n.locales.indexOf(locale) === -1) {
      return error({ message: 'This page could not be found.', statusCode: 404 })
    }
    // Set locale
    store.commit('i18n/SET_LANG', locale)
    app.i18n.locale = store.state.i18n.locale
    // If route is /<defaultLocale>/... -> redirect to /...
    if (locale === defaultLocale && route.fullPath.indexOf('/' + defaultLocale) === 0) {
      const toReplace = '^/' + defaultLocale + (route.fullPath.indexOf('/' + defaultLocale + '/') === 0 ? '/' : '')
      const re = new RegExp(toReplace)
      return redirect(
        route.fullPath.replace(re, '/')
      )
    }
  }