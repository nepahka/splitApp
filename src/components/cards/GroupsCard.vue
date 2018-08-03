<template>
  <v-ons-list>
    <v-ons-list-item
      v-for="group in groups"
      :key="group.id"
      @click="openGroup(group.id)"
    >
      <div class="center">
        {{ group.name }}
        {{ balance(group.id) }}
      </div>
      <div class="right">
        <img v-for="member in members(group.id)" :src="member.picture">
      </div>
      <div class="right list-item__right">
        <v-ons-icon icon="ion-ios-arrow-forward, material:md-arrow-forward"></v-ons-icon>
      </div>
    </v-ons-list-item>
  </v-ons-list>
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
      this.$router.push('/groups/' + id)
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
