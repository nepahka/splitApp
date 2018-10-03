<template>
  <f7-page>
    <f7-navbar back-link="Back" title="Новый платеж">
      <f7-nav-right>
        <f7-link @click="addPayment">Готово</f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>Описание</f7-block-title>
    <f7-list>
      <f7-list-item>
        <f7-input
          clear-button
          placeholder="Описание"
          type="text"
          :value="description"
          @input="description = $event.target.value"
        >
        </f7-input>
      </f7-list-item>
    </f7-list>
    <f7-block-title>Кто платит</f7-block-title>
    <f7-list>
      <f7-list-item
        link="#"
        title="Кто платит"
        v-if="!paidId"
        @click="$f7.views.main.router.navigate({url: '/groups/' + $f7router.currentRoute.params.id + '/addpayment/paidby/'})">
      </f7-list-item>
      <f7-list-item
        link="#"
        v-if="paidId"
        :title="paidBy.name"
        @click="$f7.views.main.router.navigate({url: '/groups/' + $f7router.currentRoute.params.id + '/addpayment/paidby/'})"
      >
        <img slot="media" :src="paidBy.picture">
      </f7-list-item>
    </f7-list>
    <f7-block-title>Сумма</f7-block-title>
    <f7-list>
      <f7-list-item>
        <f7-input
          clear-button
          :value="Math.round10(paidSum, -2)"
          @input="paidSum = $event.target.value"
          type="number"
          placeholder="Сумма"
        >
        </f7-input>
      </f7-list-item>
    </f7-list>
    <f7-block-title>За кого платят</f7-block-title>
    <f7-list>
      <f7-list-item title="Делить поровну">
        <f7-toggle
          :checked="isEqually"
          @change="toggleEqually"
        >
        </f7-toggle>
      </f7-list-item>
      <f7-list-item
        checkbox
        v-for="user in users"
        :key="user.id"
        :title="user.name"
        :value="user.id"
        :checked="paidToIds.indexOf(user.id) >= 0"
        @change="toggleCheckbox(user.id)"
      >
        <img slot="media" :src="user.picture">
        <!--v-show="isSelected(user.id) && !editSumVisible(user.id)"-->
        <div slot="footer">
          Сумма: {{ Math.round10(paidPies[user.id], -2) }}{{ '&nbsp;&nbsp;' }}
        </div>
        <!--@click="editSum(user.id)"-->
        <f7-button v-show="!isEqually && isSelected(user.id)" raised class="col" @click="changeSum(user)" slot="after" >
          Изменить
        </f7-button>
        <!--<div slot="footer">-->
          <!--<f7-input v-show="!isEqually"-->
                    <!--:ref="'sum' + user.id"-->
                    <!--v-model.number="pieSum"-->
                    <!--@change="changeSum(user)"-->
                    <!--@blur="editableSumId = ''"-->
                    <!--@keyup.enter="editableSumId = ''"-->
                    <!--type="number"-->
                    <!--placeholder=""-->
                    <!--style="max-width: 80px;"-->
          <!--&gt;-->
          <!--</f7-input>-->
        <!--</div>-->
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
import PaymentFormUsers from './paymentForm/PaymentFormUsers.vue'

export default {
  components: {
    PaymentFormUsers
  },
  name: 'AddPaymentForm',
  props: {},
  data() {
    return {
      debt: [],
      paidTo: [],
      paidToIds: [],
      paidSum: '',
      debtors: {},
      description: '',
      transactions: [],
      globalUsers: [],
      groupUsers: [],
      editableSumId: '',
      pieSum: 0,
      isEqually: true,
      paidPies: {},
      updateBalances: {},
      currentPayUsersBalances: {}
    }
  },
  watch: {
    paidSum() {
      this.recalcSumPieces()
    }
  },
  computed: {
    paidId: {
      get() {
        return this.$store.state.payments.paidBy
      },
      set(value) {
        this.$store.state.payments.paidBy = value
      }
    },
    paidBy() {
      return this.users.find(u => u.id === this.paidId)
    },
    users() {
      return this.$store.getters.getMembersByGroupId(this.$f7router.currentRoute.params['id'])
    },
    allUsers() {
      return this.$store.getters.getUsers
    },
    allSelected: {
      get() {
        return this.users ? this.paidToIds.length === this.users.length : true
      },
      set(value) {
        let selected = []
        let selectedIds = []

        if (value) {
          this.users.forEach(function (user) {
            selected.push(user)
            selectedIds.push('' + user.id + '')
          })
        }

        this.paidTo = selected
        this.paidToIds = selectedIds
      }
    }
  },
  created: function () {
    this.allSelected = false
  },
  methods: {
    calcCurrentPayUsersBalances() {
      let self = this
      let users = []
      for (let key in this.paidPies) {
        users.push(self.users.find(u => u.id === key))
      }
      let result = users.reduce((prev, cur) => {
        prev[cur.id] = cur.balance
        return prev
      }, {})
      return result
    },
    editSumVisible(id) {
      return id === this.editableSumId
    },
    editSum(id) {
      this.editableSumId = id
      this.pieSum = 0
      this.$nextTick(() => {
        this.$refs['sum' + this.editableSumId][0].$el.children[0].focus()
      })
    },
    changeSum(user) {
      let self = this
      this.$f7.dialog.prompt('Введите сумму?', (sum) => {
        self.pieSum = +sum
        self.paidPies[user.id] = self.pieSum
        let resultSum = 0
        for (let key in self.paidPies) {
          resultSum += self.paidPies[key]
        }
        self.paidSum = resultSum
      });
    },
    toggleCheckbox(id) {
      if (this.paidToIds.includes(id)) {
        this.paidToIds = this.paidToIds.filter(item => item !== id)
      } else {
        this.paidToIds.push(id)
      }
      let isExist = !!this.paidPies[id]
      if (isExist) {
        delete this.paidPies[id]
        this.recalcSumPieces()
      } else {
        this.calcUserSumPiece(id)
      }
    },
    toggleEqually() {
      this.isEqually = !this.isEqually
      this.recalcSumPieces()
    },
    calcUserSumPiece(id) {
      if (this.isEqually) {
        this.paidPies[id] = this.paidSum / Object.keys(this.paidPies).length
        this.recalcSumPieces()
      } else {
        this.paidPies[id] = 0
      }
    },
    recalcSumPieces() {
      if (this.isEqually) {
        for (let key in this.paidPies) {
          this.paidPies[key] = this.paidSum / Object.keys(this.paidPies).length
        }
      }
    },
    isSelected(id) {
      return this.paidToIds.includes('' + id + '')
    },
    addPayment() {
      // todo: Пересмотреть тут все очень внимательно
      this.calculateBalance()
      this.calculateDebtors()
      this.createPayment()
      this.updateUsers()
      this.clean()
      this.$router.push({ name: this.$route.matched[this.$route.matched.length - 2].name })
    },
    clean() {
      this.paidPies = []
      this.paidId = null
    },
    calculateBalance() {
      let self = this
      this.currentPayUsersBalances = this.calcCurrentPayUsersBalances()

      const paidByUserSum = {
        userId: this.paidBy.id,
        sum: +this.paidSum.toFixed(10)
      }
      this.paidBy.balance = +(this.paidBy.balance + this.paidSum - this.paidPies[this.paidBy.id]).toFixed(10)

      for (let key in this.paidPies) {
        self.transactions.push({
          userId: key,
          sum: -self.paidPies[key].toFixed(10)
        })
        self.updateBalances[key] = +(self.currentPayUsersBalances[key] - self.paidPies[key]).toFixed(10)
      }
      if (this.transactions.find(t => t.userId === paidByUserSum.userId) !== undefined) {
        this.transactions.find(t => t.userId === paidByUserSum.userId).sum += paidByUserSum.sum
      } else {
        this.transactions.push(paidByUserSum)
      }
    },
    calculateDebtors() {
      let self = this
      let users = this.allUsers
      const cloneUsers = JSON.parse(JSON.stringify(users))

      // тест нового алгоритма
      cloneUsers.forEach(function (item) {
        let isExist = !!self.updateBalances[item.id]
        if (isExist) {
          item.balance = self.updateBalances[item.id]
        }
        cloneUsers.forEach(function (debtor) {
          item.debtors[debtor.id] = 0
        })
      })
      cloneUsers.find(u => u.id === self.paidBy.id).balance = self.paidBy.balance

      let sortArray = cloneUsers.sort(r => r.balance)
      let negativeBalance = sortArray.filter(a => a.balance < 0)
      let positiveBalance = sortArray.filter(a => a.balance >= 0)
      let resultArray = []

      negativeBalance.forEach(function (item) {
        item.pseudoBalance = item.balance
      })

      positiveBalance.forEach(function (item) {
        item.pseudoBalance = item.balance
      })

      negativeBalance.forEach(function (negativeItem) {
        let curBalance = negativeItem.pseudoBalance
        positiveBalance.forEach(function (positiveItem) {
          if (positiveItem.pseudoBalance > 0 && curBalance < 0) {
            curBalance += positiveItem.pseudoBalance
            if (curBalance <= 0) {
              negativeItem.debtors[positiveItem.id] = -positiveItem.pseudoBalance
            } else {
              negativeItem.debtors[positiveItem.id] = -(positiveItem.pseudoBalance - curBalance)
              positiveItem.pseudoBalance -= (positiveItem.pseudoBalance - curBalance)
              negativeItem.pseudoBalance = 0
            }
          }
        })
        positiveBalance.sort(r => r.pseudoBalance)
      })
      negativeBalance.forEach(function (item) {
        resultArray.push(item)
      })
      positiveBalance.forEach(function (item) {
        resultArray.push(item)
      })
      resultArray.forEach(function (resultItem) {
        cloneUsers.forEach(function (trueItem) {
          if (resultItem.id === trueItem.id) {
            trueItem.debtors = resultItem.debtors
          }
        })
      })
      this.globalUsers = cloneUsers
      console.log(this.globalUsers)
    },
    calculateGroupDebtors() {
      // делаем клон
      this.groupUsers = JSON.parse(JSON.stringify(this.$store.getters.getRecalculateMembersByGroupId(this.$f7router.currentRoute.params['id'])))
      const users2 = this.groupUsers
      // тест нового алгоритма
      users2.forEach(function (item) {
        users2.forEach(function (debtor) {
          item.debtors[debtor.id] = 0
        })
      })

      let sortArray = users2.sort(r => r.balance)
      let negativeBalance = sortArray.filter(a => a.balance < 0)
      let positiveBalance = sortArray.filter(a => a.balance >= 0)
      let resultArray = []

      negativeBalance.forEach(function (item) {
        item.pseudoBalance = item.balance
      })

      positiveBalance.forEach(function (item) {
        item.pseudoBalance = item.balance
      })
      negativeBalance.forEach(function (negativeItem) {
        let curBalance = negativeItem.pseudoBalance
        positiveBalance.forEach(function (positiveItem) {
          if (positiveItem.pseudoBalance > 0 && curBalance < 0) {
            curBalance += positiveItem.pseudoBalance
            if (curBalance <= 0) {
              negativeItem.debtors[positiveItem.id] = -positiveItem.pseudoBalance
            } else {
              negativeItem.debtors[positiveItem.id] = -(positiveItem.pseudoBalance - curBalance)
              positiveItem.pseudoBalance -= (positiveItem.pseudoBalance - curBalance)
              negativeItem.pseudoBalance = 0
            }
          }
        })
        positiveBalance.sort(r => r.pseudoBalance)
      })
      negativeBalance.forEach(function (item) {
        resultArray.push(item)
      })
      positiveBalance.forEach(function (item) {
        resultArray.push(item)
      })
      resultArray.forEach(function (resultItem) {
        users2.forEach(function (trueItem) {
          if (resultItem.name === trueItem.name) {
            trueItem.debtors = resultItem.debtors
          }
        })
      })
    },
    async createPayment() {
      let paidToIds = this.paidTo.map(u => {
        return {
          userId: u.id,
          name: u.name
        }
      })
      await this.$store.dispatch('createPayment', {
        groupId: this.$f7router.currentRoute.params['id'],
        description: this.description,
        sum: this.paidSum,
        paidBy: {
          userId: this.paidBy.id,
          name: this.paidBy.name
        },
        paidTo: paidToIds,
        transactions: this.transactions
      })
      this.calculateGroupDebtors()
      this.updateGroup()
    },
    updateUsers() {
      this.globalUsers.forEach(user => {
        this.$store.dispatch('updateUser', {
          id: user.id,
          balance: user.balance,
          debtors: user.debtors
        })
      })
    },
    updateGroup() {
      let groupMembers = []
      this.groupUsers.forEach(user => {
        groupMembers.push(
          {
            id: user.id,
            debtors: user.debtors,
            balance: user.balance
          }
        )
      })
      this.$store.dispatch('updateGroup', {
        id: this.$f7router.currentRoute.params['id'],
        members: groupMembers
      })
    }
  }
}
</script>

<style scoped>
  .user-item__debt-input {
    width: 80px;
  }

  img {
    width: 20px;
    border-radius: 6px;
  }

  label {
    margin-bottom: 0;
  }

  .list-item__right .text-input {
    text-align: right !important;
  }

  .list-item__center {
    padding: 0;
  }

  .list-item__right {
    padding: 0 12px 0 0;
  }

  .switch-item {
    padding: 0 12px 0 0;
  }
</style>

<style>
  .list-item__right .text-input {
    text-align: right;
    width: 80px;
  }
</style>
