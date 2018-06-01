import Vue from 'vue'
import Vuex from 'vuex'
import users from './users'
import groups from './groups'
import payments from './payments'
import connections from './connections'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    users, groups, payments, connections
  }
})
