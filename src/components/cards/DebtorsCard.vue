<template>
  <div class="card">
    <div class="card_header">
      <h3>Кто кому должен</h3>
    </div>
    <div class="card_body">
      {{ stata }}
      <div
        v-for="user in debtors"
        :key="user.who.picture"
        class="alert alert-warning"
        role="alert"
      >
        <img :src="user.who.picture">
        <b>{{ user.who.name }}</b>
        owes
        <img :src="user.whom.picture">
        <b>{{ user.whom.name }}</b>
        <span class="sum">{{ Math.round10(user.sum, -2) }}</span>
        <button type="button" class="close" @click="settleDebt(user)">
          <span aria-hidden="true">&times;</span>
        </button>
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
  watch: {
  },
  computed: {
    stata () {
      console.log('stats')
      return this.$store.state.groups
    },
    debtors () {
      console.log('DEBTORS CARD')
      if (this.$route.params.id) {
        return this.$store.getters.getDebtorsByGroupId(+this.$route.params.id)
      } else {
        return this.$store.getters.getDebtors
      }
    }
  },
  methods: {
    settleDebt (user) {
      console.log(user)
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
