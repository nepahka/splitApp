<template>
  <div class="card">
    <div class="card_header">
      <h3>Кто кому должен</h3>
    </div>
    <div class="card_body">
      <div
        v-for="user in debtors"
        :key="user.who.picture"
        class="alert alert-warning"
        role="alert"
      >
        <img :src="user.who.picture">
        <b>{{ user.who.name }}</b>
        owes
        <img :src="user.whom.picture">
        <b>{{ user.whom.name }}</b>
        <span class="sum">{{ Math.round10(user.sum, -2) }}</span>
        <button type="button" class="close" @click="confirmSettleDebt(user)">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
    <confirm-modal v-if="confirmModal" :user="debtUser" @onCancel="cancelSettleDebt" @onConfirm="isGroup ? settleGroupDebt(debtUser) : settleDebt(debtUser)"></confirm-modal>
  </div>
</template>

<script>
import ConfirmModal from '../modals/ConfirmModal.vue'

export default {
  components: {
    ConfirmModal
  },
  props: {},
  data () {
    return {
      confirmModal: false,
      isGroup: false,
      debtUser: null
    }
  },
  watch: {},
  computed: {
    debtors () {
      console.log('DEBTORS CARD')
      if (this.$route.params.id) {
        this.isGroup = true
        return this.$store.getters.getDebtorsByGroupId(+this.$route.params.id)
      } else {
        this.isGroup = false
        return this.$store.getters.getDebtors
      }
    }
  },
  methods: {
    confirmSettleDebt (user) {
      this.confirmModal = true
      this.debtUser = user
    },
    cancelSettleDebt () {
      this.confirmModal = false
      this.debtUser = null
    },
    settleDebt ({sum, who, whom}) {
      this.confirmModal = false
      let whoUser = this.$store.getters.getUsers.find(u => u.id === who.id)
      let whomUser = this.$store.getters.getUsers.find(u => u.id === whom.id)

      console.log('settleDebt', sum, who, whom)
      whoUser.balance -= sum
      whoUser.debtors[whom.id] = 0
      whomUser.balance += sum

      this.$store.dispatch('updateUser', {
        id: whoUser.id,
        balance: whoUser.balance,
        debtors: whoUser.debtors
      })
      this.$store.dispatch('updateUser', {
        id: whomUser.id,
        balance: whomUser.balance,
        debtors: whomUser.debtors
      })
      this.$store.getters.getGroups.map(group => {
        let updatedMembers = []
        let whoGroupBalance = 0
        group.members.map(member => {
          if (member.id === who.id) {
            whoGroupBalance = member.balance
            member.balance = 0
            member.debtors[whom.id] = 0
          }
          if (member.id === whom.id) {
            member.balance += whoGroupBalance
          }
          updatedMembers.push({
            id: member.id,
            debtors: member.debtors,
            balance: member.balance
          })
        })
        this.$store.dispatch('updateGroup', {
          id: group.id,
          members: updatedMembers
        })
      })
      this.$store.dispatch('createPayment', {
        groupId: 0,
        description: 'Списан долг',
        sum: -1 * sum,
        paidBy: {
          userId: who.id,
          name: who.name
        },
        paidTo: [
          {
            userId: whom.id,
            name: whom.name
          }
        ],
        transactions: [
          {
            userId: who.id,
            sum: -1 * sum
          },
          {
            userId: whom.id,
            sum: sum
          }
        ]
      })
    },
    settleGroupDebt ({sum, who, whom}) {
      this.confirmModal = false
      let whoUser = this.$store.getters.getUsers.find(u => u.id === who.id)
      let whomUser = this.$store.getters.getUsers.find(u => u.id === whom.id)

      console.log('settleGroupDebt', sum, who, whom)
      whoUser.balance -= sum
      whoUser.debtors[whom.id] -= sum
      whomUser.balance += sum

      this.$store.dispatch('updateUser', {
        id: whoUser.id,
        balance: whoUser.balance,
        debtors: whoUser.debtors
      })
      this.$store.dispatch('updateUser', {
        id: whomUser.id,
        balance: whomUser.balance,
        debtors: whomUser.debtors
      })
      let updatedMembers = []
      let whoGroupBalance = 0
      this.$store.getters.getGroupById(+this.$route.params.id)[0].members.map(member => {
        if (member.id === who.id) {
          whoGroupBalance = member.balance
          member.balance = 0
          member.debtors[whom.id] = 0
        }
        if (member.id === whom.id) {
          member.balance += whoGroupBalance
        }
        updatedMembers.push({
          id: member.id,
          debtors: member.debtors,
          balance: member.balance
        })
      })
      this.$store.dispatch('updateGroup', {
        id: +this.$route.params.id,
        members: updatedMembers
      })
    }
  }
}

</script>

<style scoped>
  .alert img {
    width: 24px;
    height: 24px;
    margin-right: 4px;
    margin-left: 4px;
  }

  .alert img:first-child {
    margin-left: 0;
  }

  .sum {
    font-size: 16px;
    font-weight: bold;
    margin-left: 10px;
    color: darkslategrey;
  }
</style>
