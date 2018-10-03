<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <ons-back-button>Назад</ons-back-button>
      </div>
      <div class="center">{{ name }}</div>
    </v-ons-toolbar>
    <f7-block-title>Я платил</f7-block-title>
    <history-card :payments="payByMe"/>
    <f7-block-title>За меня платили</f7-block-title>
    <history-card :payments="payToMe"/>
  </v-ons-page>
</template>

<script>
import HistoryCard from '../HistoryCard.vue'

export default {
  components: {
    HistoryCard
  },
  data () {
    return {}
  },
  computed: {
    payByMe () {
      return this.$store.getters.getPaymentsFromByUserId(this.$f7router.currentRoute.params.userId)
    },
    payToMe () {
      return this.$store.getters.getPaymentsToByUserId(this.$f7router.currentRoute.params.userId)
    },
    name () {
      return this.$store.getters.getNameByUserId(this.$f7router.currentRoute.params.userId)
    }
  },
  methods: {
    paidToUsers (paidUser, paidToUsers, index) {
      let msg = ''
      msg += paidUser.name
      return msg
    },
    paidToSum (payment) {
      if (payment.transactions.find(u => u.userId === this.$f7router.currentRoute.params.userId) !== undefined) {
        return payment.transactions.find(u => u.userId === this.$f7router.currentRoute.params.userId).sum
      }
      return 0
    }
  }
}
</script>

<style>

</style>
