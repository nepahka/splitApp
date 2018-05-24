<template>
  <div class="main">
    <div class="main-row">
      <groups-card :groups="groups"/>
      <history-card
        :users="users"
        :paymentsHistory="paymentsHistory"
        @showPaymentModal="isPaymentFormVisible = $event"
      />
    </div>
    <div class="main-row">
      <users-card
        :users="users"
        @showUsersModal="isUsersFormVisible = $event"/>
      <debtors-card :owes-users="owesUsers"/>
    </div>
    <users-form
      v-if="isUsersFormVisible"
      @addUser="addUser"
    />
    <payment-form
      v-if="isPaymentFormVisible"
      :users="users"
      @history="addHistory"
    />
  </div>
</template>

<script>
import PaymentForm from './PaymentForm.vue'
import UsersForm from './UsersForm.vue'
import UsersCard from './UsersCard.vue'
import GroupsCard from './GroupsCard.vue'
import DebtorsCard from './DebtorsCard.vue'
import HistoryCard from './HistoryCard.vue'

export default {
  components: {
    UsersForm, PaymentForm, UsersCard, GroupsCard, DebtorsCard, HistoryCard
  },
  data () {
    return {
      isUsersFormVisible: false,
      isPaymentFormVisible: false,
      users: [
        {
          id: 1,
          name: 'vasya',
          balance: 0,
          picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg',
          debtors: {}
        },
        {
          id: 2,
          name: 'petya',
          balance: 0,
          picture: 'https://randomuser.me/api/portraits/thumb/lego/2.jpg',
          debtors: {}
        },
        {
          id: 3,
          name: 'masha',
          balance: 0,
          picture: 'https://randomuser.me/api/portraits/thumb/lego/3.jpg',
          debtors: {}
        }
      ],
      groups: [{
        id: 1,
        name: 'Hatchery',
        members: [
          {
            id: 1,
            name: 'vasya',
            balance: 0,
            picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg',
            debtors: {}
          },
          {
            id: 2,
            name: 'petya',
            balance: 0,
            picture: 'https://randomuser.me/api/portraits/thumb/lego/2.jpg',
            debtors: {}
          },
          {
            id: 3,
            name: 'masha',
            balance: 0,
            picture: 'https://randomuser.me/api/portraits/thumb/lego/3.jpg',
            debtors: {}
          }
        ]
      }],
      owesUsers: [],
      paymentsHistory: []
    }
  },
  computed: {
  },
  methods: {
    addUser (name, picture) {
      this.users.push({
        id: this.users.length + 1,
        name: name,
        picture: picture,
        balance: 0,
        debtors: {}
      })
      this.isUsersFormVisible = false
    },
    addHistory (description, paidBy, paidTo, paidSum) {
      this.calculateDebts()
      this.paymentsHistory.push({
        description: description,
        paidBy: paidBy,
        paidTo: paidTo,
        paidSum: paidSum
      })
      this.isPaymentFormVisible = false
    },
    calculateDebts () {
      this.owesUsers.splice(0, this.owesUsers.length)
      let debtors = this.users
      let self = this
      debtors.forEach(function (item, i) {
        for (let debtor in item.debtors) {
          if (item.debtors[debtor] < 0) {
            self.owesUsers.push({
              who: {
                name: item.name,
                picture: item.picture
              },
              whom: {
                name: debtors.filter(u => u.name === debtor)[0].name,
                picture: debtors.filter(u => u.name === debtor)[0].picture
              },
              sum: item.debtors[debtor]
            })
          }
        }
      })
    }
  }
}
</script>

<style>
  .card_header {
    min-height: 38px
  }
  .alert img {
    width: 32px;
    border-radius: 50%;
    margin-right: 12px;
  }
</style>
