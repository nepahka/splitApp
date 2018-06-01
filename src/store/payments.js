class Payment {
  constructor (groupId, description, sum, paidBy, paidTo, transactions) {
    this.groupId = groupId
    this.description = description
    this.sum = sum
    this.paidBy = paidBy
    this.paidTo = paidTo
    this.transactions = transactions
  }
}

export default {
  state: {
    payments: []
  },
  mutations: {
    updatePayments (state, payments) {
      state.payments = payments
    },
    addPayment (state, payment) {
      state.payments.push(payment)
    }
  },
  actions: {
    async fetchPayments ({commit}, payload) {
      const response = await fetch('http://localhost:3000/payments')
      const payments = await response.json()
      console.log('fetchPayments', payments)
      commit('updatePayments', payments)
    },
    async createPayment ({commit}, {groupId, description, sum, paidBy, paidTo, transactions}) {
      const newGroup = new Payment(groupId, description, sum, paidBy, paidTo, transactions)
      console.log(newGroup)
      const response = await fetch('http://localhost:3000/payments',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newGroup)
        })
      const payment = await response.json()
      commit('addPayment', payment)
    }
  },
  getters: {
    getPayments (state) {
      return state.payments
    },
    getPaymentByGroupId: (state, getters) => (id) => {
      console.log('Вызов getPaymentByGroupId', id)
      return state.payments.filter(payment => payment.groupId === id)
    },
    getRecalculateMembersByGroupId: (state, getters, rootState, rootGetters) => (id) => {
      let members = rootGetters.getMembersByGroupId(id)
      console.log('Вызов getRecalculateMembersByGroupId', id, state.payments)
      let curPayments = getters.getPaymentByGroupId(id)
      console.log(members)
      // calculate payments
      const clone = members.map(a => ({...a}))
      clone.map(d => {
        d.balance = 0
      })
      clone.forEach(m => {
        curPayments.forEach(g => g.transactions.forEach(t => {
          if (t.userId === m.id) {
            m.balance += t.sum
          }
        }))
      })
      return clone
    }
  }
}
