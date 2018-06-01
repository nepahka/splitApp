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
    addGroup (state, group) {
      state.groups.push(group)
    }
  },
  actions: {
    async fetchGroups ({commit}, payload) {
      const response = await fetch('http://localhost:3000/groups')
      const groups = await response.json()
      console.log('fetchGroups', groups)
      commit('updateGroups', groups)
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
      commit('addGroup', group)
    }
  },
  getters: {
    getGroups (state) {
      return state.groups
    },
    getGroupById: (state, getters) => ({id}) => {
      return state.groups.find(group => group.id === id)
    }
  }
}
