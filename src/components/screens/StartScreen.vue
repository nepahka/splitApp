<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="center">PieApp</div>
    </v-ons-toolbar>
    <br>
    <v-ons-list-title>
      <div class="left">Группы</div>
      <div class="right">
        <v-ons-icon @click="$router.push({name: 'GroupsForm'})" icon="ion-ios-add, material:md-add"></v-ons-icon>
      </div>
    </v-ons-list-title>
    <groups-card
      :groups="groups"
    />
    <br>
    <v-ons-list-title>
      <div class="left">Пользователи</div>
      <div class="right">
        <v-ons-icon @click="$router.push({name: 'UsersForm'})" icon="ion-ios-add, material:md-add"></v-ons-icon>
      </div>
    </v-ons-list-title>
    <users-card
      :users="users"
    />
    <br>
    <v-ons-list-title>
      <div class="left">Должники</div>
    </v-ons-list-title>
    <debtors-card :users="users"/>
  </v-ons-page>
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
  props: {},
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
    addGroup () {
      this.isGroupsFormVisible = false
    }
  }
}
</script>

<style scoped>
  .list-title {
    /*color: #1f1f21;*/
    display: flex;
    justify-content: space-between;
    /*font-size: 20px;*/
    /*letter-spacing: 0;*/
    /*font-weight: 400;*/
    /*text-transform: none;*/
    /*line-height: 30px;*/
    /*padding: 0 6px 0 16px;*/
  }
  .list-title .left {
    /*padding: 4px 0;*/
  }
  .button--quiet {
    padding-top: 0;
    padding-bottom: 0;
  }
  .ion-ios-add {
    font-size: 20px;
    color: #0076ff;
    padding: 0 12px;
  }
</style>
