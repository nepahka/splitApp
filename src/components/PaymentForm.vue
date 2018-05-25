<template>
  <div class="card">
    <h1 class="display-4 center">Add Payment</h1>
    <hr>
    <div class="form-group">
      <label>Description</label>
      <input
        v-model="description"
        class="form-control"
        type="text"
        placeholder="Description"
      >
    </div>
    <div class="form-group">
      <label for="paidby">Paid by</label>
      <!--<paid-by :users="users"></paid-by>-->
      <select
        id="paidby"
        v-model="paidBy"
        class="form-control"
      >
        <option
          disabled
          value=""
        >
          Выберите один из вариантов
        </option>
        <option
          v-for="user in users"
          :key="user.id"
          :value="user"
        >
          {{ user.name }}
        </option>
      </select>
    </div>
    <div class="form-group">
      <label>Summa</label>
      <input
        v-model.number="paidSum"
        class="form-control"
        type="number"
        placeholder="Введите сумму"
      >
    </div>
    <div class="form-group">
      <label>Paid to</label>
      <div
        v-for="(user, index) in users"
        :key="user.id"
        class="user-item"
        @click="toggleCheckbox(user)"
      >
        <div class="user-item__checkbox">
          <label
            :for="'paidto-' + index"
            class="form-check-label"
          >
            <input
              :id="'paidto-' + index"
              :value="user"
              :checked="isSelected(user)"
              type="checkbox"
            >
          </label>
        </div>
        <div class="user-item__img">
          <img
            :src="user.picture"
          >
        </div>
        <div class="user-item__name">
          {{ user.name }}
        </div>
        <input
          v-show="isSelected(user)"
          :value="calcDebt(user)"
          class="user-item__debt-input"
          type="number"
          placeholder=""
          @click.stop=""
        >
      </div>
    </div>
    <button
      type="button"
      class="btn btn-success"
      @click="addPayment"
    >
      Add
    </button>
  </div>
</template>

<script>
export default {
  name: 'AddPaymentForm',
  props: {
    users: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      debt: [],
      paidBy: '',
      paidTo: [],
      paidSum: '',
      debtors: {},
      description: 'Новая платежка'
    }
  },
  computed: {
    allSelected: {
      get () {
        return this.users ? this.paidTo.length === this.users.length : true
      },
      set (value) {
        var selected = []

        if (value) {
          this.users.forEach(function (user) {
            selected.push(user)
          })
        }

        this.paidTo = selected
      }
    }
  },
  created: function () {
    this.allSelected = true
    this.paidBy = this.users[0]
  },
  methods: {
    toggleCheckbox (user) {
      if (this.paidTo.includes(user)) {
        this.paidTo.splice(this.paidTo.findIndex(u => u === user), 1)
      } else {
        this.paidTo.push(user)
      }
    },
    calcDebt (user) {
      if (this.paidTo.length) {
        if (this.paidTo.includes(user)) {
          this.paidTo[this.paidTo.indexOf(user)].debt = (this.paidSum / this.paidTo.length)
        }
      }
      return Math.round10(this.paidSum / this.paidTo.length, -2)
    },
    isSelected (user) {
      return this.paidTo.includes(user)
    },
    addPayment () {
      this.calculateBalance()
      this.calculateDebtors()
      this.$emit('history', this.description, this.paidBy, this.paidTo, this.paidSum)
    },
    calculateBalance () {
      this.paidBy.balance = +(this.paidBy.balance + this.paidSum).toFixed(10)

      this.paidTo.forEach(function (debtor) {
        debtor.balance = +(debtor.balance - debtor.debt).toFixed(10)
      })
    },
    calculateDebtors () {
      let self = this

      // тест нового алгоритма
      this.paidTo.forEach(function (item) {
        self.paidTo.forEach(function (debtor) {
          item.debtors[debtor.name] = 0
        })
      })

      let sortArray = this.paidTo.sort(r => r.balance)
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
              negativeItem.debtors[positiveItem.name] = -positiveItem.pseudoBalance
            } else {
              negativeItem.debtors[positiveItem.name] = -(positiveItem.pseudoBalance - curBalance)
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
        self.paidTo.forEach(function (trueItem) {
          if (resultItem.name === trueItem.name) {
            trueItem.debtors = resultItem.debtors
          }
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .card {
    position: fixed;
    transform: translate(-50%, -50%);
    width: 32rem;
    padding: 30px;
    text-align: left;
    top: 50%;
    left: 50%;
  }

  label {
    font-size: 20px;
  }

  .center {
    text-align: center;
  }

  .user-item {
    display: flex;
    align-items: center;
    height: 40px;
  }
  .user-item ~ .user-item {
    border-top: 1px solid #eee;
  }
  .user-item__img {
    width: 32px;
    height: 32px;
    margin-right: 12px;
    margin-left: 12px;
    border-radius: 50%;
    overflow: hidden;
  }
  .user-item__img img {
    width: inherit;
    height: inherit;
  }
  .user-item__checkbox {
    position: relative;
    top: -3px;
  }
  .user-item__name {

  }
  .user-item__debt-input {
    width: 80px;
    text-align: right;
    border: none;
    margin-left: auto;
    height: 39px;
    outline: none;
    padding: 0;
  }
</style>
