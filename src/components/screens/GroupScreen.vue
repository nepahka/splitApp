<template>
  <div class="main">
    <div class="main-row">
      <group-card/>
      <history-card
        @showPaymentModal="isPaymentFormVisible = $event"
      />
    </div>
    <div class="main-row">
      <users-card/>
      <debtors-card/>
    </div>
    <payment-form
      v-if="isPaymentFormVisible"
      @history="addHistory"
    />
  </div>
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
  props: {
  },
  data () {
    return {
      isPaymentFormVisible: false,
      owesUsers: []
    }
  },
  computed: {
  },
  methods: {
    addHistory () {
      this.isPaymentFormVisible = false
    }
  }
}
</script>

<style>

</style>
