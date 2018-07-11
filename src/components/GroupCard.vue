<template>
  <div class="card">
    <div class="card_header">
      <h3>Текущая группа</h3>
      <button
        type="button"
        class="btn btn-primary"
        @click="goBack"
      >Назад
      </button>
    </div>
    <div class="card_body">
      {{ group.name }}
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
  computed: {
    group () {
      return this.$store.getters.getGroupById(+this.$route.params.id)
    }
  },
  methods: {
    goBack () {
      this.$router.push('/')
    }
  }
}
</script>

<style>

</style>
