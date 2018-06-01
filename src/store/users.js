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
    updateUsers (state, users) {
      state.users = users
    },
    addUser (state, user) {
      state.users.push(user)
    },
    updateUser (state, user) {
      console.log('Mutation updateUser')
      let curUser = state.users.find(u => u.id === user.id)
      return {
        ...curUser,
        ...user
      }
    }
  },
  actions: {
    async fetchUsers ({commit}, payload) {
      const response = await fetch('http://localhost:3000/users')
      const users = await response.json()
      console.log('fetchUsers', users)
      commit('updateUsers', users)
    },
    async createUser ({commit}, {name, picture}) {
      const newUser = new User(name, picture)
      const response = await fetch('http://localhost:3000/users',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newUser)
        })
      const user = await response.json()
      commit('addUser', user)
    },
    async updateUser ({commit}, {id, balance, debtors}) {
      console.log('Actions updateUser')
      const response = await fetch('http://localhost:3000/users/' + id,
        {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({balance: balance, debtors: debtors})
        })
      const updatedUser = await response.json()
      console.log(updatedUser)
      commit('updateUser', updatedUser)
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
        for (let debtor in item.debtors) {
          if (item.debtors[debtor] < 0) {
            result.push({
              who: {
                name: item.name,
                picture: item.picture
              },
              whom: {
                name: debtors.filter(u => u.name === debtor)[0].name,
                picture: debtors.filter(u => u.name === debtor)[0].picture
              },
              sum: item.debtors[debtor]
            })
          }
        }
      })
      return result
    }
  }
}
