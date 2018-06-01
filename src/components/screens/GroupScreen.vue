<template>
  <div class="main">
    <div class="main-row">
      <group-card :id="+id"/>
      <history-card
        :id="+id"
        @showPaymentModal="isPaymentFormVisible = $event"
      />
    </div>
    <div class="main-row">
      <users-card :users="members"/>
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

export default {
  components: {
    GroupCard, HistoryCard, PaymentForm, UsersCard
  },
  props: {
    id: String
  },
  data () {
    return {
      isPaymentFormVisible: false,
      owesUsers: []
    }
  },
  computed: {
    members () {
      return this.$store.getters.getRecalculateMembersByGroupId(+this.id)
    }
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
