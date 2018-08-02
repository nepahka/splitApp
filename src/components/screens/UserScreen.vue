<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <ons-back-button>Назад</ons-back-button>
      </div>
      <div class="center">{{ name }}</div>
    </v-ons-toolbar>
    <br>
    <v-ons-list-title>Я платил</v-ons-list-title>
    <history-card :payments="payByMe"/>
    <br>
    <v-ons-list-title>За меня платили</v-ons-list-title>
    <history-card :payments="payToMe"/>
    <br>
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
      return this.$store.getters.getPaymentsFromByUserId(this.$route.params.userId)
    },
    payToMe () {
      return this.$store.getters.getPaymentsToByUserId(this.$route.params.userId)
    },
    name () {
      return this.$store.getters.getNameByUserId(this.$route.params.userId)
    }
  },
  methods: {
    paidToUsers (paidUser, paidToUsers, index) {
      let msg = ''
      msg += paidUser.name
      return msg
    },
    paidToSum (payment) {
      if (payment.transactions.find(u => u.userId === this.$route.params.userId) !== undefined) {
        return payment.transactions.find(u => u.userId === this.$route.params.userId).sum
      }
      return 0
    }
  }
}
</script>

<style>

</style>
