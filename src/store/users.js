/* eslint-disable no-unused-vars */
class User {
  constructor (name, picture, balance = 0, debtors = {}) {
    this.name = name
    this.picture = picture
    this.balance = balance
    this.debtors = debtors
  }
}

export default {
  state: {
    users: []
  },
  mutations: {
    fetchUsers (state, users) {
      console.log('Mutation fetchUsers', users)
      state.users = users
    },
    createUser (state, user) {
      console.log('Mutation createUser', user)
      state.users.push({...user})
    },
    updateUser (state, {id, balance, debtors}) {
      console.log('Mutation updateUser')
      let current = state.users.find(u => u.id === id)
      current.balance = balance
      current.debtors = debtors
    }
  },
  actions: {
    async fetchUsers ({commit, rootState}, payload) {
      const response = rootState.db.collection('users')
      const users = await response.get()
      console.log('async fetchUsers', users)
      let result = []
      users.forEach(user => result.push({id: user.id, ...user.data()}))
      commit('fetchUsers', result)
    },
    async createUser ({commit, rootState}, {name, picture}) {
      const newUser = new User(name, picture)
      const response = rootState.db.collection('users').add({...newUser})
      let user = await response
      console.log('async createUser', user)
      commit('createUser', {id: user.id, ...newUser})
    },
    async updateUser ({commit, rootState}, {id, balance, debtors}) {
      console.log('Actions updateUser', {id, balance, debtors})
      const response = rootState.db.collection('users').doc(id).update({balance: balance, debtors: debtors})
      const updatedUser = await response
      console.log('async updateUser', updatedUser)
      commit('updateUser', {id, balance, debtors})
    }
  },
  getters: {
    getUsers (state) {
      return state.users
    },
    getDebtors (state) {
      let result = []
      let debtors = state.users
      debtors.forEach(function (item, i) {
        for (let userId in item.debtors) {
          console.log(item.debtors[userId])
          if (item.debtors[userId] < 0) {
            result.push({
              who: {
                id: item.id,
                name: item.name,
                picture: item.picture
              },
              whom: {
                id: userId,
                name: debtors.filter(u => u.id === userId)[0].name,
                picture: debtors.filter(u => u.id === userId)[0].picture
              },
              sum: item.debtors[userId]
            })
          }
        }
      })
      return result
    },
    getNameByUserId: (state, getters) => (id) => {
      let user = state.users.filter(u => u.id === id)[0]
      return user.name
    },
    getPictureByUserId: (state, getters) => (id) => {
      let user = state.users.filter(u => u.id === id)[0]
      return user.picture
    },
    getUserById: (state, getters) => (id) => {
      return state.users.filter(u => u.id === id)[0]
    }
  }
}
