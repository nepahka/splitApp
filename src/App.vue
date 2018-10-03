<template>
  <f7-app :params="f7params">
    <!-- Statusbar -->
    <f7-statusbar></f7-statusbar>

    <!-- Main View -->
    <f7-view url="/" main v-if="loading" :pushState="true"></f7-view>
  </f7-app>
</template>

<script>
/* eslint-disable no-return-assign */
import routes from './router'

export default {
  name: 'App',
  data () {
    return {
      f7params: {
        id: 'io.pieapp.testapp', // App bundle ID
        name: 'PieApp', // App name
        theme: 'auto', // Automatic theme detection
        // App routes
        routes: routes,
        pushState: true
      },
      pageStack: [],
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
  computed: {},
  watch: {}
}
</script>

<style lang="scss">
  @import '../node_modules/ionicons/dist/css/ionicons.min.css';
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

  .back-button__label {
    font-weight: 400;
  }

  .list-item:only-child {
    margin: 0;
  }
</style>
