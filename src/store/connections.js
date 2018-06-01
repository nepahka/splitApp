class Connection {
  constructor (id1, id2) {
    this.groupId = id1
    this.userId = id2
  }
}

export default {
  state: {
    connections: []
  },
  mutations: {
    updateConnections (state, connections) {
      state.connections = connections
    },
    addConnection (state, connection) {
      state.connections.push(connection)
    }
  },
  actions: {
    async fetchConnections ({commit}, payload) {
      const response = await fetch('http://localhost:3000/connections')
      const connections = await response.json()
      console.log('fetchComnnections', connections)
      commit('updateConnections', connections)
    },
    async createConnection ({commit}, {groupId, userId}) {
      const newConnection = new Connection(groupId, userId)
      console.log(newConnection)
      const response = await fetch('http://localhost:3000/connections',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newConnection)
        })
      const connection = await response.json()

      commit('addConnection', connection)
    }
  },
  getters: {
    getMembersByGroupId: (state, getters, rootState) => (id) => {
      console.log('Вызов getMembersByGroupId', id)
      let result = []
      let curConnections = state.connections.filter(c => {
        return c.groupId === id
      })
      curConnections.map(c => {
        result.push(rootState.users.users.find(u => u.id === c.userId))
      })
      return result
    }
  }
}
