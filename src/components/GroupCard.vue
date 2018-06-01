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
    id: Number
  },
  data () {
    return {}
  },
  computed: {
    group (id) {
      return this.$store.getters.getGroupById(id)
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
