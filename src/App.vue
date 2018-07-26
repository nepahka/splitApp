<template>
  <div id="app">
    <v-ons-navigator
      v-if="loading"
      :page-stack="pageStack"
      :pop-page="goBack"
    ></v-ons-navigator>
    <!--<router-view />-->
  </div>
</template>

<script>
/* eslint-disable no-return-assign */

export default {
  name: 'App',
  data () {
    return {
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
    /* Define how routes should be mapped to the page stack.
     * This assumes all the routes contain VOnsPage components
     * and are provided in the 'default' view.
     * For nested named routes or routes that for some reason
     * should not be mapped in VOnsNavigator, filter them out here.
     */
    const mapRouteStack = route => this.pageStack = route.matched.map(m => m.components.default)
    /* Set initial pageStack depending on current
     * route instead of always pushing 'Home' page
     */
    mapRouteStack(this.$route)
    /* On route change, reset the pageStack to the next route */
    this.$router.beforeEach((to, from, next) => mapRouteStack(to) && next())
  },
  computed: {
  },
  methods: {
    /* Override default pop behavior and delegate it to the router */
    goBack () {
      debugger
      // Go to the parent route component
      console.log(this.$route.matched[this.$route.matched.length - 2].name)
      this.$router.push({ name: this.$route.matched[this.$route.matched.length - 2].name })
      // this.$router.go(-1); // Could work but might be misleading in some situations
    }
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
