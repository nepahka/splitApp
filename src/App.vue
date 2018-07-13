<template>
  <div id="app">
    <router-view v-if="loading"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      loading: false
    }
  },
  created () {
    this.$store.dispatch('fetchConnections').then(() => {
      this.$store.dispatch('fetchPayments').then(() => {
        this.$store.dispatch('fetchUsers').then(() => {
          this.$store.dispatch('fetchGroups').then(() => {
            this.loading = true
          })
        })
      })
    })
  },
  computed: {
  },
  methods: {
  },
  watch: {}
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  h3 {
    margin-bottom: 0;
  }

  .card {
    flex: 1;
    padding: 30px;
    text-align: left;
    max-width: calc(50% - 1rem);
  }

  .card ~ .card {
    margin-left: 2rem;
  }

  .main-row {
    width: 64rem;
    display: flex;
    margin: 0 auto;
  }

  .main-row ~ .main-row {
    margin-top: 2rem;
  }

  .card_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }
</style>
