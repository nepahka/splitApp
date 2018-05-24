<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
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
