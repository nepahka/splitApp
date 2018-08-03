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
            @change="toggleCheckbox(user.id)"
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
          {{ paidPies[user.id] }}{{ '&nbsp;&nbsp;' }}
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
    paidSum () {
      this.recalcSumPieces()
    }
  },
  computed: {
    paidId: {
      get () {
        return this.$store.state.payments.paidBy
      },
      set (value) {
        this.$store.state.payments.paidBy = value
      }
    },
    paidBy () {
      return this.users.find(u => u.id === this.paidId)
    },
    users () {
      return this.$store.getters.getMembersByGroupId(this.$route.params['id'])
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
    calcCurrentPayUsersBalances () {
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
      this.paidPies[user.id] = this.pieSum
      let resultSum = 0
      for (let key in this.paidPies) {
        resultSum += this.paidPies[key]
      }
      this.paidSum = resultSum
    },
    toggleCheckbox (id) {
      let isExist = !!this.paidPies[id]
      if (isExist) {
        delete this.paidPies[id]
        this.recalcSumPieces()
      } else {
        this.calcUserSumPiece(id)
      }
    },
    calcUserSumPiece (id) {
      if (this.isEqually) {
        this.paidPies[id] = this.paidSum / Object.keys(this.paidPies).length
        this.recalcSumPieces()
      } else {
        this.paidPies[id] = 0
      }
    },
    recalcSumPieces () {
      if (this.isEqually) {
        for (let key in this.paidPies) {
          this.paidPies[key] = this.paidSum / Object.keys(this.paidPies).length
        }
      }
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
      this.$router.push({name: this.$route.matched[this.$route.matched.length - 2].name})
    },
    clean () {
      this.paidPies = []
      this.paidId = null
    },
    calculateBalance () {
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
    calculateDebtors () {
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
    calculateGroupDebtors () {
      // делаем клон
      this.groupUsers = JSON.parse(JSON.stringify(this.$store.getters.getRecalculateMembersByGroupId(this.$route.params['id'])))
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
        groupId: this.$route.params['id'],
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
      this.globalUsers.forEach(user => {
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
        id: this.$route.params['id'],
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
