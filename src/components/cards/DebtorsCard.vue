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
        <button type="button" class="close" @click="settleDebt(user)">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
  },
  data () {
    return {}
  },
  watch: {
  },
  computed: {
    debtors () {
      console.log('DEBTORS CARD')
      if (this.$route.params.id) {
        return this.$store.getters.getDebtorsByGroupId(+this.$route.params.id)
      } else {
        return this.$store.getters.getDebtors
      }
    }
  },
  methods: {
    settleDebt ({sum, who, whom}) {
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
