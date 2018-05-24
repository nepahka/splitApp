<template>
  <div class="card">
    <div class="card_header">
      <h3>Список пользователей</h3>
      <button
        type="button"
        class="btn btn-primary"
        @click="showUsersModal"
      >Add user
      </button>
    </div>
    <div class="card_body">
      <div
        v-for="user in users"
        :key="user.id"
        class="alert"
        :class="user.balance >= 0 ? 'alert-success' : 'alert-danger'"
      >
        <img :src="user.picture">
        {{ user.name }} : {{ user.balance }}
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    users: {
      type: Array,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    showUsersModal () {
      this.$emit('showUsersModal', true)
    }
  }
}
</script>

<style>

</style>
