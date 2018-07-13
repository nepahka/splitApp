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
      {{ name }}
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
    name () {
      if (this.$route.params.id) {
        return this.$store.getters.getGroupById(+this.$route.params.id)[0].name
      } else {
        return ''
      }
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
