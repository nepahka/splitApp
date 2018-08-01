<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <ons-back-button>Назад</ons-back-button>
      </div>
      <div class="center">Новый платеж</div>
      <div class="right">
        <v-ons-toolbar-button @click="addPayment">
          Готово
        </v-ons-toolbar-button>
      </div>
    </v-ons-toolbar>
    <br>
    <v-ons-list-title>Описание</v-ons-list-title>
    <v-ons-list>
      <v-ons-list-item>
        <div class="center">
          <v-ons-input
            float
            v-model="description"
            placeholder="Описание"
          >
          </v-ons-input>
        </div>
      </v-ons-list-item>
    </v-ons-list>
    <br>
    <v-ons-list-title>Кто</v-ons-list-title>
    <v-ons-list>
      <v-ons-list-item v-if="!paidId" @click="$router.push({name: 'PaymentFormUsers'})">
        <div class="center list-item__center" style="height: 55px; color: #999;">
          Выберите
        </div>
        <div class="right list-item__right">
          <v-ons-icon icon="ion-ios-arrow-forward, material:md-forward"></v-ons-icon>
        </div>
      </v-ons-list-item>
      <v-ons-list-item v-if="paidId" @click="$router.push({name: 'PaymentFormUsers'})">
        <div class="left list-item__left">
          <img :src="paidBy.picture">
        </div>
        <div class="center list-item__center">
          {{ paidBy.name }}
        </div>
        <div class="right list-item__right">
          <v-ons-icon icon="ion-ios-arrow-forward, material:md-forward"></v-ons-icon>
        </div>
      </v-ons-list-item>
    </v-ons-list>
    <br>
    <v-ons-list-title>Сумма</v-ons-list-title>
    <v-ons-list>
      <v-ons-list-item>
        <div class="center">
          <v-ons-input
            float
            v-model.number="paidSum"
            type="number"
            placeholder="Сумма"
          >
          </v-ons-input>
        </div>
      </v-ons-list-item>
    </v-ons-list>
    <br>
    <v-ons-list-title>За кого</v-ons-list-title>
    <v-ons-list>
      <ons-list-item>
        <label class="center" for="switch1">
          Равные части
        </label>
        <div class="right">
          <v-ons-switch
            input-id="switch1"
            v-model="isEqually"
          >
          </v-ons-switch>
        </div>
      </ons-list-item>
      <v-ons-list-item
        v-for="(user, index) in users"
        :key="user.id"
      >
        <label class="left">
          <v-ons-checkbox
            :input-id="'paidto-' + index"
            :value="user.id"
            v-model="paidToIds"
            @change="toggleCheckbox(user)"
          >
          </v-ons-checkbox>
        </label>
        <label :for="'paidto-' + index" class="left">
          <img :src="user.picture">
        </label>
        <label :for="'paidto-' + index" class="center">
          {{ user.name }}
        </label>
        <div class="right" v-show="isSelected(user.id) && !editSumVisible(user.id)">
          {{ calcDebt(user) }}{{ '&nbsp;&nbsp;' }}
          <v-ons-icon v-show="!isEqually" icon="ion-ios-color-wand, material:md-color-wand" @click="editSum(user.id)"></v-ons-icon>
        </div>
        <div class="right" v-show="editSumVisible(user.id)">
          <v-ons-input
            :ref="'sum' + user.id"
            float
            v-model.number="pieSum"
            @change="changeSum(user)"
            @blur="editableSumId = ''"
            @keyup.enter="editableSumId = ''"
            type="number"
            placeholder=""
          >
          </v-ons-input>
        </div>
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
import PaymentFormUsers from './paymentForm/PaymentFormUsers.vue'

export default {
  components: {
    PaymentFormUsers
  },
  name: 'AddPaymentForm',
  props: {},
  data () {
    return {
      debt: [],
      paidTo: [],
      paidToIds: [],
      paidSum: '',
      debtors: {},
      description: '',
      transactions: [],
      groupUsers: [],
      editableSumId: '',
      pieSum: 0,
      isEqually: true
    }
  },
  computed: {
    paidPies: {
      get () {
        return this.$store.state.payments.paidPies
      },
      set (value) {
        this.$store.state.payments.paidPies = value
      }
    },
    paidId: {
      get () {
        return this.$store.state.payments.paidBy
      },
      set (value) {
        this.$store.state.payments.paidBy = value
      }
    },
    paidBy () {
      return this.users.find(u => u.id === +this.paidId)
    },
    users () {
      return this.$store.getters.getMembersByGroupId(+this.$route.params['id'])
    },
    allUsers () {
      return this.$store.getters.getUsers
    },
    allSelected: {
      get () {
        return this.users ? this.paidToIds.length === this.users.length : true
      },
      set (value) {
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
    editSumVisible (id) {
      return id === this.editableSumId
    },
    editSum (id) {
      this.editableSumId = id
      this.pieSum = 0
      this.$nextTick(() => {
        this.$refs['sum' + this.editableSumId][0].$el.children[0].focus()
      })
    },
    changeSum (user) {
      this.paidTo[this.paidTo.indexOf(user)].debt = this.pieSum
      this.$store.commit('updatePaidPies', {
        userId: user.id,
        sum: this.pieSum
      })
      this.paidSum = this.paidPies.reduce((previousValue, currentItem) => {
        return previousValue + currentItem.sum
      }, 0)
    },
    toggleCheckbox (user) {
      if (this.paidTo.includes(user)) {
        this.paidTo.splice(this.paidTo.findIndex(u => u === user), 1)
        this.$store.commit('removePaidPie', user.id)
      } else {
        this.paidTo.push(user)
      }
    },
    calcDebt (user) {
      if (this.paidTo.length) {
        if (this.paidTo.includes(user)) {
          let isExist = !!this.paidPies.find(u => u.userId === user.id)
          if (this.isEqually) {
            this.paidTo[this.paidTo.indexOf(user)].debt = (this.paidSum / this.paidTo.length)
            this.$store.commit('updatePaidPies', {
              userId: user.id,
              sum: this.paidSum / this.paidTo.length
            })
          }
          if (isExist) {
            return Math.round10(this.paidPies.find(u => u.userId === user.id).sum, -2)
          } else {
            this.$store.commit('updatePaidPies', {
              userId: user.id,
              sum: 0
            })
            return 0
          }
        }
      }
      return 0
    },
    isSelected (id) {
      return this.paidToIds.includes('' + id + '')
    },
    addPayment () {
      // todo: Пересмотреть тут все очень внимательно
      this.calculateBalance()
      this.calculateDebtors()
      this.createPayment()
      this.updateUsers()
      this.clean()
      this.$router.push({ name: this.$route.matched[this.$route.matched.length - 2].name })
    },
    clean () {
      this.paidPies = []
      this.paidId = null
    },
    calculateBalance () {
      let self = this
      const paidByUserSum = {
        userId: this.paidBy.id,
        sum: +this.paidSum.toFixed(10)
      }
      this.paidBy.balance = +(this.paidBy.balance + this.paidSum).toFixed(10)

      this.paidTo.forEach(function (debtor) {
        self.transactions.push({
          userId: debtor.id,
          sum: -debtor.debt.toFixed(10)
        })
        debtor.balance = +(debtor.balance - debtor.debt).toFixed(10)
        console.log('BALANCE', debtor.balance)
      })
      if (this.transactions.find(t => t.userId === paidByUserSum.userId) !== undefined) {
        this.transactions.find(t => t.userId === paidByUserSum.userId).sum += paidByUserSum.sum
      } else {
        this.transactions.push(paidByUserSum)
      }
    },
    calculateDebtors () {
      let users = this.allUsers
      // тест нового алгоритма
      users.forEach(function (item) {
        users.forEach(function (debtor) {
          item.debtors[debtor.id] = 0
        })
      })

      let sortArray = users.sort(r => r.balance)
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
        users.forEach(function (trueItem) {
          if (resultItem.id === trueItem.id) {
            trueItem.debtors = resultItem.debtors
          }
        })
      })
    },
    calculateGroupDebtors () {
      // делаем клон
      this.groupUsers = JSON.parse(JSON.stringify(this.$store.getters.getRecalculateMembersByGroupId(+this.$route.params['id'])))
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
    async createPayment () {
      let paidToIds = this.paidTo.map(u => {
        return {
          userId: u.id,
          name: u.name
        }
      })
      await this.$store.dispatch('createPayment', {
        groupId: +this.$route.params['id'],
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
    updateUsers () {
      this.allUsers.forEach(user => {
        this.$store.dispatch('updateUser', {
          id: user.id,
          balance: user.balance,
          debtors: user.debtors
        })
      })
    },
    updateGroup () {
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
        id: +this.$route.params['id'],
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
    width: 32px;
    border-radius: 50%;
  }

  label {
    margin-bottom: 0;
  }
  .list-item__right .text-input {
    text-align: right;
  }
</style>

<style>
  .list-item__right .text-input {
    text-align: right;
    width: 80px;
  }
</style>
