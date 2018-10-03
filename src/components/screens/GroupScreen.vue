<template>
  <f7-page>
    <f7-navbar back-link="Back" :title="name">
      <f7-nav-right>
        <f7-link @click="addPayment">Добавить</f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>
      Члены
    </f7-block-title>
    <users-card/>
    <f7-block-title>
      Должники
    </f7-block-title>
    <debtors-card/>
    <f7-block-title>
      История платежей
    </f7-block-title>
    <history-card/>
  </f7-page>
</template>

<script>
import GroupCard from '../GroupCard.vue'
import UsersCard from '../cards/UsersCard.vue'
import HistoryCard from '../HistoryCard.vue'
import PaymentForm from '../forms/PaymentForm.vue'
import DebtorsCard from '../cards/DebtorsCard.vue'

export default {
  components: {
    GroupCard, HistoryCard, PaymentForm, UsersCard, DebtorsCard
  },
  props: {},
  data () {
    return {
      owesUsers: []
    }
  },
  computed: {
    name () {
      if (this.$f7router.currentRoute.params.id) {
        return this.$store.getters.getGroupById(this.$f7router.currentRoute.params.id)[0].name
      } else {
        return ''
      }
    }
  },
  methods: {
    addPayment () {
      this.$f7.views.main.router.navigate({url: '/groups/' + this.$f7router.currentRoute.params.id + '/addpayment'})
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
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
</style>
