<template>
  <div class="history-item alert alert-info">
    <div class="history-item__description">
      {{ historyItem.description }}
    </div>
    <div class="history-item__message">
      Paid by {{ historyItem.paidBy.name }} for
      <span
        v-for="(paidUser, index) in historyItem.paidTo"
        :key="paidUser.id"
      >
        {{ paidToUsers(paidUser, index) }}
      </span>
    </div>
    <div class="history-item__count">
      {{ historyItem.paidSum }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    historyItem: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {}
  },
  methods: {
    paidToUsers (paidUser, index) {
      let msg = ''
      msg += paidUser.name
      if (index + 1 !== this.historyItem.paidTo.length) {
        msg += ', '
      } else {
        msg += ''
      }
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
