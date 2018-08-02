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
    payments: [],
    paidBy: ''
  },
  mutations: {
    updatePaidBy (state, paidBy) {
      state.paidBy = paidBy
    },
    fetchPayments (state, payments) {
      console.log('Mutation fetchPayments', payments)
      state.payments = payments
    },
    createPayment (state, payment) {
      console.log('Mutation createPayment', payment)
      state.payments.push({...payment})
    }
  },
  actions: {
    async fetchPayments ({commit, rootState}, payload) {
      const response = rootState.db.collection('payments')
      const payments = await response.get()
      console.log('async fetchPayments', payments)
      let result = []
      payments.forEach(payment => result.push({id: payment.id, ...payment.data()}))
      commit('fetchPayments', result)
    },
    async createPayment ({commit, rootState}, {groupId, description, sum, paidBy, paidTo, transactions}) {
      const newPayment = new Payment(groupId, description, sum, paidBy, paidTo, transactions)
      const response = rootState.db.collection('payments').add({...newPayment})
      const payment = await response
      console.log('async createPayment', payment)
      commit('createPayment', {id: payment.id, ...newPayment})
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
    getPaymentsFromByUserId: (state, getters) => (id) => {
      console.log('Вызов getPaymentsFromByUserId', id)
      return state.payments.filter(payment => payment.paidBy.userId === id)
    },
    getPaymentsToByUserId: (state, getters) => (id) => {
      console.log('Вызов getPaymentsToByUserId', id)
      return state.payments.filter(payment => {
        return payment.paidBy.userId !== id && payment.paidTo.filter(to => to.userId === id).length
      })
    },
    getRecalculateMembersByGroupId: (state, getters, rootState, rootGetters) => (id) => {
      let members = rootGetters.getMembersByGroupId(id)
      console.log('Вызов getRecalculateMembersByGroupId', id)
      let curPayments = getters.getPaymentByGroupId(id)
      // calculate payments
      const clone = JSON.parse(JSON.stringify(members))
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
