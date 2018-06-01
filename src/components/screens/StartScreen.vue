<template>
  <div class="main">
    <div class="main-row">
      <groups-card
        :groups="groups"
        @showGroupsModal="isGroupsFormVisible = $event"
      />
      <history-card
        @showPaymentModal="isPaymentFormVisible = $event"
      />
    </div>
    <div class="main-row">
      <users-card
        :users="users"
        @showUsersModal="isUsersFormVisible = $event"
      />
      <debtors-card :users="users"/>
    </div>
    <groups-form
      v-if="isGroupsFormVisible"
      @addGroup="addGroup"
    />
    <users-form
      v-if="isUsersFormVisible"
      @addUser="addUser"
    />
  </div>
</template>

<script>
import GroupsForm from '../forms/GroupsForm.vue'
import UsersForm from '../forms/UsersForm.vue'
import UsersCard from '../cards/UsersCard.vue'
import GroupsCard from '../cards/GroupsCard.vue'
import DebtorsCard from '../cards/DebtorsCard.vue'
import HistoryCard from '../HistoryCard.vue'

export default {
  components: {
    GroupsForm, UsersForm, UsersCard, GroupsCard, DebtorsCard, HistoryCard
  },
  props: {
  },
  data () {
    return {
      isUsersFormVisible: false,
      isGroupsFormVisible: false,
      owesUsers: []
    }
  },
  computed: {
    users () {
      return this.$store.getters.getUsers
    },
    groups () {
      return this.$store.getters.getGroups
    }
  },
  methods: {
    addUser () {
      this.isUsersFormVisible = false
    },
    addGroup () {
      this.isGroupsFormVisible = false
    }
  }
}
</script>

<style>
  .card_header {
    min-height: 38px
  }
</style>
