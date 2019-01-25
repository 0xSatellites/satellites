import firebase from 'firebase';
import 'firebase/firestore';

if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: process.env.apiKey,
        authDomain: process.env.authDomain,
        projectId: process.env.projectId
      });
 }

var db = firebase.firestore();

export const state = () => ({
  order: {},
  orderlist: {},
  balance: 0,
})

export const getters = {
    order: state => state.order,
    orderlist: state => state.orderlist,
    balance: state => state.balance,
}

export const mutations = {

  clearOrder(state) {
    state.order = {}
  },

  setOrder(state, order) {
    state.order = order
  },

  setOrderList(state, orderList) {
    state.orderList = orderList
  }

}

export const actions = {

  async clear({ state, commit }) {
    commit('clearOrder')
  },

  async detail({ state, commit }, query) {
    console.log(query)
    await db.collection("order").where(query.key, "==", String(query.value)).get()
    .then(function(querySnapshot){
      querySnapshot.forEach(function(doc) {
        commit('setOrder', doc.data());
      });
    })
  },

  async list({ state, commit }, key, value) {
    var list = []
    await db.collection("order").where(String(key), "==", String(value)).get()
    .then(function(querySnapshot){
      querySnapshot.forEach(function(doc) {
        list.push(doc.data())
      });
    })
    commit('setOrderList', list);
  }

}
