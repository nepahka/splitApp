<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <ons-back-button>Назад</ons-back-button>
      </div>
      <div class="center">
        {{ name }}
      </div>
      <div class="right">
        <v-ons-toolbar-button @click="$router.push({name: 'PaymentForm'})">
          Платеж
        </v-ons-toolbar-button>
      </div>
    </v-ons-toolbar>
    <br>
    <v-ons-list-title>
      <div class="left">Члены</div>
    </v-ons-list-title>
    <users-card/>
    <br>
    <v-ons-list-title>
      <div class="left">Должники</div>
    </v-ons-list-title>
    <debtors-card/>
    <br>
    <v-ons-list-title>
      <div class="left">История платежей</div>
    </v-ons-list-title>
    <history-card/>
  </v-ons-page>
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
      isPaymentFormVisible: false,
      owesUsers: []
    }
  },
  computed: {
    name () {
      if (this.$route.params.id) {
        return this.$store.getters.getGroupById(this.$route.params.id)[0].name
      } else {
        return ''
      }
    }
  },
  methods: {
    addHistory () {
      this.isPaymentFormVisible = false
    }
  }
}
</script>

<style scoped>
  .list-title {
    color: #1f1f21;
    display: flex;
    justify-content: space-between;
    font-size: 20px;
    letter-spacing: 0;
    font-weight: 400;
    text-transform: none;
    line-height: 30px;
    padding: 0 6px 0 16px;
  }
  .list-title .left {
    padding: 4px 0;
  }
  .button--quiet {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
</style>
