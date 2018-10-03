<template>
  <f7-list media-list>
    <f7-list-item
      v-for="payment in currentPayments"
      :key="payment.id"
      :title="payment.description"
      :subtitle="subtitle(payment)"
      :after="payment.sum"
    >
    </f7-list-item>
  </f7-list>
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
      if (this.$f7router.currentRoute.params.id) {
        return this.$store.getters.getPaymentByGroupId(this.$f7router.currentRoute.params.id)
      } else {
        return this.payments
      }
    }
  },
  methods: {
    subtitle (payment) {
      let paidTo = payment.paidTo.reduce((prev, cur) => {
        return prev + cur.name + ', '
      }, '').slice(0, -2)
      return payment.paidBy.name + ' заплатил за ' + paidTo
    },
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
