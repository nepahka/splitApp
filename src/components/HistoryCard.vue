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
    <history-card-item
      v-for="historyItem in paymentsHistory"
      :key="historyItem.id"
      :history-item="historyItem"
      class="card_body"
    />
  </div>
</template>

<script>
import HistoryCardItem from './HistoryCardItem.vue'

export default {
  components: {
    HistoryCardItem
  },
  props: {
    paymentsHistory: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    showPaymentModal () {
      this.$emit('showPaymentModal', true)
    }
  }
}
</script>

<style scoped>
</style>
