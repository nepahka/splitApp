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
    paidBy: '',
    paidPies: []
  },
  mutations: {
    updatePaidBy (state, paidBy) {
      state.paidBy = paidBy
    },
    updatePaidPies (state, {userId, sum}) {
      if (state.paidPies.find(u => u.userId === userId)) {
        state.paidPies.find(u => u.userId === userId).sum = sum
      } else {
        state.paidPies.push({userId: userId, sum: sum})
      }
      console.log('state.paidPies', state.paidPies)
    },
    removePaidPie (state, userId) {
      state.paidPies.splice(state.paidPies.findIndex(u => u.userId === userId), 1)
      console.log('state.paidPies', state.paidPies)
    },
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
      console.log('createPayment', payment)
      commit('addPayment', payment)
    }
  },
  getters: {
    getPayments (state) {
      return state.payments
    },
    getPaidPies (state) {
      return state.paidPies
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
