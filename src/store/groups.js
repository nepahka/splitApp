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
    fetchGroups (state, groups) {
      console.log('Mutation fetchGroups', groups)
      state.groups = groups
    },
    createGroup (state, group) {
      console.log('Mutation createGroup', group)
      state.groups.push({...group})
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
    async fetchGroups ({commit, rootState}, payload) {
      const response = await rootState.db.collection('groups')
      const groups = await response.get()
      console.log('async fetchGroups', groups)
      let result = []
      groups.forEach(group => result.push({id: group.id, ...group.data()}))
      commit('fetchGroups', result)
    },
    async createGroup ({commit, rootState}, {name, members}) {
      const newGroup = new Group(name, members)
      const response = rootState.db.collection('groups').add({...newGroup})
      const group = await response
      console.log('async createGroup', group.id)
      commit('createGroup', {id: group.id, ...newGroup})
    },
    async updateGroup ({commit, rootState}, {id, members}) {
      console.log('Actions updateGroup', members)
      const response = rootState.db.collection('groups').doc(id).update({members: members})
      const updateGroup = await response
      console.log('async updatedGroup', updateGroup)
      commit('updateGroup', {id, members})
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
    }
  },
  getters: {
    getGroups (state) {
      return state.groups
    },
    getGroupById: (state, getters) => (id) => {
      console.log('Вызов getGroupById')
      return state.groups.filter(group => group.id === id)
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
                id: debtor,
                name: rootGetters.getNameByUserId(debtors.filter(u => u.id === debtor)[0].id),
                picture: rootGetters.getPictureByUserId(debtors.filter(u => u.id === debtor)[0].id)
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
