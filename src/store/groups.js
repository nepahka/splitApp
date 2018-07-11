class Group {
  constructor (name, members) {
    this.name = name
    this.members = members
  }
}

export default {
  state: {
    groups: []
  },
  mutations: {
    updateGroups (state, groups) {
      state.groups = groups
    },
    createGroup (state, group) {
      state.groups.push(group)
    },
    updateGroup (state, group) {
      console.log('Mutation updateGroup')
      let curGroup = state.groups.find(g => g.id === group.id)
      return {
        ...curGroup,
        ...group
      }
    }
  },
  actions: {
    async fetchGroups ({commit}, payload) {
      const response = await fetch('http://localhost:3000/groups')
      const groups = await response.json()
      console.log('fetchGroups', groups)
      commit('updateGroups', groups)
    },
    async updateGroup ({commit}, {id, name, members}) {
      console.log('Actions updateGroup', members)
      const response = await fetch('http://localhost:3000/groups/' + id,
        {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({name: name, members: members})
        })
      const updateGroup = await response.json()
      console.log('updatedGroup', updateGroup)
      commit('updateGroup', updateGroup)
    },
    async createGroup ({commit}, {name, members}) {
      const newGroup = new Group(name, members)
      const response = await fetch('http://localhost:3000/groups',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newGroup)
        })
      const group = await response.json()
      commit('createGroup', group)
    }
  },
  getters: {
    getGroups (state) {
      return state.groups
    },
    getGroupById: (state, getters) => (id) => {
      console.log('Вызов getGroupById', state.groups.filter(group => group.id === +id))
      return state.groups.filter(group => group.id === +id)
    },
    getDebtorsByGroupId: (state, getters, rootState, rootGetters) => (id) => {
      let result = []
      let debtors = getters.getGroupById(id)[0].members
      console.warn(debtors)
      debtors.forEach(function (item, i) {
        for (let debtor in item.debtors) {
          if (item.debtors[debtor] < 0) {
            result.push({
              who: {
                name: rootGetters.getNameByUserId(item.userId),
                picture: rootGetters.getPictureByUserId(item.userId)
              },
              whom: {
                name: rootGetters.getNameByUserId(debtors.filter(u => u.userId === +debtor)[0].userId),
                picture: rootGetters.getPictureByUserId(debtors.filter(u => u.userId === +debtor)[0].userId)
              },
              sum: item.balance
            })
          }
        }
      })
      return result
    }
  }
}
