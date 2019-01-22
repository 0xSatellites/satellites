import axios from 'axios'
// import firebase from 'firebase';
// import 'firebase/firestore';

// firebase.initializeApp({
//   apiKey: process.env.apiKey,
//   authDomain: process.env.authDomain,
//   projectId: process.env.projectId
// });

// // Initialize Cloud Firestore through Firebase
// console.log(firebase)
// var db = firebase.firestore();

export const state = () => ({
  hero: {},
  balance: 0,
})

export const getters = {
    hero: state => state.hero,
    balance: state => state.balance,
}

export const mutations = {

  clearHero(state) {
    state.hero = {}
  },

  setHero(state, hero) {
    state.hero = hero
  }

}

export const actions = {

  async clear({ state, commit }) {
    commit('clearHero')    
  },

  async detail({ state, commit }, data) {
    var response = await axios.get(process.env.API + "hero/token?id=" + id);

    // db.collection("order").where("data", "==", data)
    // .get()
    // .then(function(querySnapshot) {
    //     querySnapshot.forEach(function(doc) {
    //         // doc.data() is never undefined for query doc snapshots
    //         console.log(doc.id, " => ", doc.data());
    //     });
    // })
    // .catch(function(error) {
    //     console.log("Error getting documents: ", error);
    // });


    commit('setHero', response.data)    
  },

}
