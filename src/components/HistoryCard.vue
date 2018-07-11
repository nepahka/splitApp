<template>
  <div class="card">
    <div class="card_header">
      <h3>История платежей</h3>
      <button
        type="button"
        class="btn btn-primary"
        @click="showPaymentModal"
      >Add payment
      </button>
    </div>
    <div class="card_body">
      <div
        class="history-item alert alert-info"
        v-for="payment in payments"
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
</template>

<script>
export default {
  props: {
  },
  data () {
    return {}
  },
  computed: {
    payments () {
      return this.$store.getters.getPaymentByGroupId(+this.$route.params.id)
    }
  },
  methods: {
    showPaymentModal () {
      this.$emit('showPaymentModal', true)
    },
    paidToUsers (paidUser, paidToUsers, index) {
      let msg = ''
      msg += paidUser.name
      return msg
    }
  }
}
</script>

<style>
  .history-item__count {
    font-weight: bold;
    font-size: 20px;
  }
</style>
