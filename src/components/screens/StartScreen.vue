<template>
  <f7-page>
    <f7-navbar title="PieApp"></f7-navbar>
    <f7-block-title>
      Группы
    </f7-block-title>
    <groups-card
      :groups="groups"
    />
    <f7-block-footer>
      <f7-link @click="$f7.views.main.router.navigate({url: '/addgroup/'})">Добавить группу</f7-link>
    </f7-block-footer>
    <f7-block-title>
      Пользователи
    </f7-block-title>
    <users-card
      :users="users"
    />
    <f7-block-title>
      <div class="left">Должники</div>
    </f7-block-title>
    <debtors-card :users="users"/>
  </f7-page>
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
