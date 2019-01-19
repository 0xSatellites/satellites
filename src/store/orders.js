import axios from 'axios'
import * as firebase from 'firebase';
// import firebase from 'firebase';
import 'firebase/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDmvuJJL7dmVeDb52Xo6Ou5gLSRTu2FQr0",
  authDomain: "bazaaar-test.firebaseapp.com",
  projectId: "bazaaar-test"
});

// Initialize Cloud Firestore through Firebase
console.log(firebase)
var db = firebase.firestore();

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

export const state = () => ({
  orders: [],
  balance: 0
})

export const getters = {
    orders: state => state.orders,
    balance: state => state.balance
}

export const mutations = {

  clearOrders(state) {
    state.orders = []
  },

  setOrders(state, orders) {
    state.orders = orders
  },

  pushOrders(state, orders) {
    state.orders = state.orders.concat(orders)
  },

  setBalance(state, balance) {
    state.balance = balance
  },  

}

export const actions = {

  async clear({ state, commit }) {
    commit('clearOrders')    
  },

  async initial({ state, commit }) {

    var response = await db.collection('order').doc('1')
      db.collection("order").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${doc.data()}`);
          //response.push(doc.data())
        });
     });
  

    commit('setOrders', response.data)
  },

  async load({ state, commit }, from) {
    console.log("load:" + from)
    var response = await axios.get(process.env.API + "hero/ownedTokens?address=0xaA64dd8e189b067A82Ea66C523CdDA19F6f0E9e3&from=" + from);
    commit('pushOrders', response.data)    
  },  

  async detail({ state, commit }, id) {
    var response = await axios.get(process.env.API + "hero/token?id=" + id);
    commit('setOrders', response.data)    
  },

  async balance({ state, commit }) {
    var response = await axios.get(process.env.API + "hero/balance?address=0xaA64dd8e189b067A82Ea66C523CdDA19F6f0E9e3");
    commit('setBalance', response.data)    
  },  


}
