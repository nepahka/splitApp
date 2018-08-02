<template>
  <v-ons-list modifier="inset">
    <v-ons-list-item
      tappable
      v-for="user in members"
      :key="user.id"
      @click="openUserScreen(user.id)"
    >
      <div class="left">
        <img :src="picture(user.id)">
      </div>
      <div class="center">
        {{ name(user.id) }} : {{ user.balance }}
      </div>
      <div class="right list-item__right">
        <v-ons-icon icon="ion-ios-arrow-forward, material:md-arrow-forward"></v-ons-icon>
      </div>
    </v-ons-list-item>
  </v-ons-list>
</template>

<script>
export default {
  props: {},
  data () {
    return {}
  },
  computed: {
    members () {
      console.log('USERS CARD')
      if (this.$route.params.id) {
        return this.$store.getters.getGroupById(this.$route.params.id)[0].members
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
      this.$router.push('/users/' + userId)
    }
  }
}
</script>

<style scoped>
  img {
    width: 32px;
    border-radius: 50%;
  }
</style>
