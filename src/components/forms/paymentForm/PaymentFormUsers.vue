<template>
  <f7-page>
    <f7-navbar back-link="Back" title="Кто платит"></f7-navbar>

    <f7-list>
      <f7-list-item
        radio
        v-for="(user, index) in users"
        :key="user.id"
        :title="user.name"
        :value="user.name"
        :checked="paidBy === user.id"
        @change="commitPaidByToStore(user.id)"
      >
        <img slot="media" :src="user.picture">
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
export default {
  props: {},
  data () {
    return {
      paidBy: this.$store.state.payments.paidBy
    }
  },
  computed: {
    users () {
      return this.$store.getters.getMembersByGroupId(this.$f7router.currentRoute.params['id'])
    }
  },
  methods: {
    commitPaidByToStore (id) {
      this.$store.commit('updatePaidBy', '' + id + '')
      this.$f7.views.main.router.back()
    }
  }
}
</script>

<style scoped>
  img {
    width: 20px;
    border-radius: 6px;
  }

  label {
    margin-bottom: 0;
  }
</style>
