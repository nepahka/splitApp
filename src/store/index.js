import Vue from 'vue'
import Vuex from 'vuex'
import users from './users'
import groups from './groups'
import payments from './payments'
import connections from './connections'
import Firebase from 'Firebase/app'
import 'Firebase/firestore'

Firebase.initializeApp({
  apiKey: 'AIzaSyBk6M90VAqEL6L7fsZZW1DN7ndRS9HQ8gw',
  authDomain: 'pie-app-2018.firebaseapp.com',
  databaseURL: 'https://pie-app-2018.firebaseio.com',
  projectId: 'pie-app-2018',
  storageBucket: 'pie-app-2018.appspot.com',
  messagingSenderId: '724148888563'
})

Vue.use(Vuex)

const state = {
  db: Firebase.firestore()
}

state.db.settings({timestampsInSnapshots: true})

export default new Vuex.Store({
  state,
  modules: {
    users, groups, payments, connections
  }
})
