export const state = () => ({
  address: '',
  balance: 0,
  twitterAccount:{}
})

export const getters = {
  account: state => {
    const account = {
      address:state.address,
      balance:state.balance,
      twitterAccount:state.twitterAccount
    }
    return account
  }
}

export const mutations = {
  setAccount(state, account) {
    state.address = account.address
    state.balance = account.balance
  },
  setTwitterAccount(state, twitterAccount) {
    state.twitterAccount = twitterAccount
  }
}

export const actions = {
  async setAccount({ state, commit }, account) {
    commit('setAccount', account)
  },
  async setTwitterAccount({ state, commit }, account) {
    commit('setTwitterAccount', account)
  },
}
