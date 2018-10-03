<template>
  <f7-list>
    <f7-list-item
      v-for="group in groups"
      :key="group.id"
      @click="openGroup(group.id)"
      link="#"
      :title="group.name"
      :after="balance(group.id)"
    >
      <img slot="media" v-for="(member, index) in members(group.id)" :key="index" :src="member.picture">
    </f7-list-item>
  </f7-list>
</template>

<script>
export default {
  props: {
    groups: Array
  },
  data () {
    return {}
  },
  computed: {},
  methods: {
    members (id) {
      return this.$store.getters.getMembersByGroupId(id)
    },
    balance (id) {
      return this.$store.getters.getPaymentByGroupId(id).reduce((sum, item) => {
        return sum + item.sum
      }, 0)
    },
    openGroup (id) {
      this.$f7.views.main.router.navigate({url: '/groups/' + id})
    }
  }
}
</script>

<style scoped>
  img {
    width: 20px;
    border-radius: 6px;
  }

  img ~ img {
    margin-left: 12px;
  }
</style>
