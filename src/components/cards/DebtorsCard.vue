<template>
  <div class="card">
    <div class="card_header">
      <h3>Кто кому должен</h3>
    </div>
    <div class="card_body">
      <div
        v-for="user in debtors"
        :key="user.id"
        class="alert alert-warning"
        role="alert"
      >
        <img :src="user.who.picture">
        <b>{{ user.who.name }}</b>
        owes
        <img :src="user.whom.picture">
        <b>{{ user.whom.name }}</b>
        <span class="sum">{{ Math.round10(user.sum, -2) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
  },
  data () {
    return {
    }
  },
  computed: {
    debtors () {
      return this.$store.getters.getDebtors
    }
  }
}
</script>

<style scoped>
  .alert img {
    width: 24px;
    height: 24px;
    margin-right: 4px;
    margin-left: 4px;
  }
  .alert img:first-child {
    margin-left: 0;
  }
  .sum {
    font-size: 16px;
    font-weight: bold;
    margin-left: 10px;
    color: darkslategrey;
  }
</style>
