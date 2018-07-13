<template>
  <div class="main">
    <div class="main-row">
      <div class="card">
        <div class="card_header">
          <h3>Я платил</h3>
          <button
            type="button"
            class="btn btn-primary"
            @click="goBack"
          >Назад
          </button>
        </div>
        <div class="card_body">
          <div
            class="history-item alert alert-info"
            v-for="payment in payByMe"
            :key="payment.id"
          >
            <div class="history-item__description">
              {{ payment.description }}
            </div>
            <div class="history-item__message">
              Paid by {{ payment.paidBy.name }} for
              <span
                v-for="(paidUser, index) in payment.paidTo"
                :key="paidUser.id"
              >
            {{ paidToUsers(paidUser, index) }}
          </span>
            </div>
            <div class="history-item__count">
              {{ payment.sum }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main-row">
      <div class="card">
        <div class="card_header">
          <h3>За меня платили</h3>
        </div>
        <div class="card_body">
          <div
            class="history-item alert alert-info"
            v-for="payment in payToMe"
            :key="payment.id"
          >
            <div class="history-item__description">
              {{ payment.description }}
            </div>
            <div class="history-item__message">
              Paid by {{ payment.paidBy.name }} for
              <span
                v-for="(paidUser, index) in payment.paidTo"
                :key="paidUser.id"
              >
                {{ paidToUsers(paidUser, index) }}
              </span>
            </div>
            <div class="history-item__count">
              {{ paidToSum(payment) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {
    payByMe () {
      return this.$store.getters.getPaymentsFromByUserId(+this.$route.params.userId)
    },
    payToMe () {
      return this.$store.getters.getPaymentsToByUserId(+this.$route.params.userId)
    }
  },
  methods: {
    paidToUsers (paidUser, paidToUsers, index) {
      let msg = ''
      msg += paidUser.name
      return msg
    },
    paidToSum (payment) {
      if (payment.transactions.find(u => u.userId === +this.$route.params.userId) !== undefined) {
        return payment.transactions.find(u => u.userId === +this.$route.params.userId).sum
      }
      return 0
    },
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style>

</style>
