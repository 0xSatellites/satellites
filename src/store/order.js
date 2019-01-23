import axios from 'axios'
import firebase from 'firebase';
import 'firebase/firestore';

if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: process.env.apiKey,
        authDomain: process.env.authDomain,
        projectId: process.env.projectId
      });
 }

// Initialize Cloud Firestore through Firebase
console.log(firebase)
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

  setOrder(state, orderlist) {
    state.orderlist = orderlist
  },

  searchOrder(state, order) {
    state.order = order
  }

}

export const actions = {

  async clear({ state, commit }) {
    commit('clearOrder')    
  },

  async detail({ state, commit }, id) {
    
    var list = ""
    // var list = []
    // db.collection("order").orderBy("price", "desc").limit(2)
    db.collection("order").where("id", "==", String(id)).where("status", "==", true)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            list = doc.data()
            // list.push(doc.data())
        });
        commit('setOrder', list)
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });  
  },

  async search({ state, commit }, hash) {
    
    var order = ""
    await db.collection("order").where("hash", "==", hash)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            order = doc.data()
        });
        commit('searchOrder', order)
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });  
  },

}
