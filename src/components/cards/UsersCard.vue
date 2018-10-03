<template>
  <f7-list>
    <f7-list-item
      v-for="user in members"
      :key="user.id"
      @click="openUserScreen(user.id)"
      link="#"
      :title="name(user.id)"
      :after="user.balance"
    >
      <img slot="media" :src="picture(user.id)">
    </f7-list-item>
  </f7-list>
</template>

<script>
export default {
  props: {},
  data () {
    return {}
  },
  computed: {
    members () {
      let isExist = Object.keys(this.$f7router.currentRoute).length === 0 || Object.keys(this.$f7router.currentRoute.params).length === 0
      console.log('USERS CARD', isExist)
      if (!isExist) {
        return this.$store.getters.getGroupById(this.$f7router.currentRoute.params.id)[0].members
      } else {
        return this.$store.getters.getUsers
      }
    }
  },
  methods: {
    picture (id) {
      return this.$store.getters.getPictureByUserId(id)
    },
    name (id) {
      return this.$store.getters.getNameByUserId(id)
    },
    openUserScreen (userId) {
      this.$f7router.navigate('/users/' + userId)
    }
  }
}
</script>

<style scoped>
  img {
    width: 29px;
    height: 29px;
    border-radius: 6px;
    box-sizing: border-box;
  }
</style>
