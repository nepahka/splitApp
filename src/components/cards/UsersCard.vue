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
        v-for="user in members"
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
  },
  data () {
    return {
    }
  },
  computed: {
    members () {
      console.log('USERS CARD')
      if (this.$route.params.id) {
        return this.$store.getters.getRecalculateMembersByGroupId(+this.$route.params.id)
      } else {
        return this.$store.getters.getUsers
      }
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
  .alert img {
    width: 32px;
    border-radius: 50%;
    margin-right: 12px;
  }
</style>
