import axios from 'axios'
import firebase from 'firebase';
import 'firebase/firestore';

firebase.initializeApp({
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId
});

// Initialize Cloud Firestore through Firebase
console.log(firebase)
var db = firebase.firestore();

export const state = () => ({
  heroes: [],
  balance: 0
})

export const getters = {
    heroes: state => state.heroes,
    balance: state => state.balance
}

export const mutations = {

  clearHeroes(state) {
    state.heroes = []
  },

  setHeroes(state, heroes) {
    console.log(heroes)
    state.heroes = heroes
  },

  pushHeroes(state, heroes) {
    state.heroes = state.heroes.concat(heroes)
  },

  setBalance(state, balance) {
    state.balance = balance
  },  

}

export const actions = {

  async clear({ state, commit }) {
    commit('clearHeroes')    
  },

  async initial({ state, commit }) {
    
      var list = []
      db.collection("order").get().then((querySnapshot) => {
        
        querySnapshot.forEach((doc) => {
            list.push(doc.data())
            
        });
        commit('setHeroes', list)
    });

  },

  async load({ state, commit }, from) {
    console.log("load:" + from)
    var response = await axios.get(process.env.API + "hero/ownedTokens?address=0xaA64dd8e189b067A82Ea66C523CdDA19F6f0E9e3&from=" + from);
    commit('pushHeroes', response.data)    
  },  

  async detail({ state, commit }, id) {
    var response = await axios.get(process.env.API + "hero/token?id=" + id);
    commit('setheroes', response.data)    
  },

  async balance({ state, commit }) {
    var response = await axios.get(process.env.API + "hero/balance?address=0xaA64dd8e189b067A82Ea66C523CdDA19F6f0E9e3");
    commit('setBalance', response.data)    
  },  


}
