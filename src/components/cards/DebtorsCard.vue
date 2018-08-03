<template>
  <v-ons-list modifier="inset" class="debtors-card">
    <v-ons-list-item
      v-for="user in debtors"
      :key="user.id"
    >
      <div class="center">
        <b>{{ user.who.name }}</b>
        <img :src="user.who.picture">
        должен
        <b>{{  user.whom.name }}</b>
        <img :src="user.whom.picture">
        <span class="sum">: {{ -Math.round10(user.sum, -2) }}</span>
      </div>
      <div class="right">
        <v-ons-icon
          icon="ion-ios-arrow-dropup, material:md-arrow-dropup"
          size="18px, material: 18px"
          @click="confirmSettleDebt(user)"
        ></v-ons-icon>
      </div>
      <confirm-modal v-if="confirmModal" :user="debtUser" @onCancel="cancelSettleDebt" @onConfirm="isGroup ? settleGroupDebt(debtUser) : settleDebt(debtUser)"></confirm-modal>
    </v-ons-list-item>
  </v-ons-list>
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
        return this.$store.getters.getDebtorsByGroupId(this.$route.params.id)
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
      // хорошо перепроверить эту часть
      whoUser.balance -= sum
      whomUser.balance += sum
      whomUser.debtors[who.id] += sum

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
      this.$store.getters.getGroupById(this.$route.params.id)[0].members.map(member => {
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
        id: this.$route.params.id,
        members: updatedMembers
      })
      this.$store.dispatch('createPayment', {
        groupId: this.$route.params.id,
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

  .sum {
    font-size: 16px;
    font-weight: bold;
    margin-left: 10px;
    color: darkslategrey;
  }
  img {
    width: 32px;
    border-radius: 50%;
  }
  .debtors-card img {
    margin: 0 6px
  }
  b ~ b {
    margin-left: 6px;
  }
</style>
