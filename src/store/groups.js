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
    updateGroup (state, {id, members}) {
      console.log('Mutation updateGroup')
      state.groups.find(g => g.id === id).members = members
    },
    updateGroupMember (state, {id, memberID, debtors, balance}) {
      console.log('Mutation updateGroupMember')
      let member = state.groups.find(g => g.id === id).members.find(m => m.id === memberID)
      member.debtors = debtors
      member.balance = balance
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
      console.log('async updatedGroup', updateGroup)
      commit('updateGroup', updateGroup)
    },
    async updateGroupMember ({commit}, {id, memberID, debtors, balance}) {
      console.log('Actions updateGroup', id, memberID, debtors, balance)
      const response = await fetch('http://localhost:3000/groups/' + id,
        {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: id,
            members: {
              id: memberID,
              debtors: debtors,
              balance: balance
            }
          })
        })
      const updateGroupMember = await response.json()
      console.log('async updateGroupMember', updateGroupMember)
      commit('updateGroupMember', updateGroupMember)
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
      console.log('Вызов getGroupById')
      return state.groups.filter(group => group.id === +id)
    },
    getDebtorsByGroupId: (state, getters, rootState, rootGetters) => (id) => {
      console.log('Вызов getDebtorsByGroupId')
      let result = []
      let debtors = getters.getGroupById(id)[0].members
      debtors.forEach(function (item, i) {
        for (let debtor in item.debtors) {
          if (item.debtors[debtor] < 0) {
            result.push({
              who: {
                id: item.id,
                name: rootGetters.getNameByUserId(item.id),
                picture: rootGetters.getPictureByUserId(item.id)
              },
              whom: {
                id: +debtor,
                name: rootGetters.getNameByUserId(debtors.filter(u => u.id === +debtor)[0].id),
                picture: rootGetters.getPictureByUserId(debtors.filter(u => u.id === +debtor)[0].id)
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
