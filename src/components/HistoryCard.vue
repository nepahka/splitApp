<template>
  <v-ons-list modifier="inset">
    <v-ons-list-item
      v-for="payment in currentPayments"
      :key="payment.id"
    >
      <div class="center">
        <span class="list-item__title">{{ payment.description }}</span>
        <span class="list-item__subtitle">
          {{ payment.paidBy.name }} заплатил за
          <span
            v-for="(paidUser, index) in payment.paidTo"
            :key="paidUser.id"
          >
            {{ paidToUsers(paidUser, index) }}
          </span>
        </span>
      </div>
      <div class="right">
        {{ payment.sum }}
      </div>
    </v-ons-list-item>
  </v-ons-list>
</template>

<script>
export default {
  props: {
    payments: Array
  },
  data () {
    return {}
  },
  computed: {
    currentPayments () {
      if (this.$route.params.id) {
        return this.$store.getters.getPaymentByGroupId(this.$route.params.id)
      } else {
        return this.payments
      }
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

</style>
