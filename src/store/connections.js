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
    fetchConnections (state, connections) {
      console.log('Mutation fetchConnections', connections)
      state.connections = connections
    },
    createConnection (state, connection) {
      console.log('Mutation createConnection', connection)
      state.connections.push({...connection})
    }
  },
  actions: {
    async fetchConnections ({commit, rootState}, payload) {
      const response = await rootState.db.collection('connections')
      const connections = await response.get()
      console.log('fetchConnections', connections)
      let result = []
      connections.forEach(connection => result.push({id: connection.id, ...connection.data()}))
      commit('fetchConnections', result)
    },
    async createConnection ({commit, rootState}, {groupId, userId}) {
      const newConnection = new Connection(groupId, userId)
      const response = rootState.db.collection('connections').add({...newConnection})
      const connection = await response
      console.log('async createConnection', connection.id)
      commit('createConnection', {id: connection.id, ...newConnection})
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
