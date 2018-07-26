<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <ons-back-button>Назад</ons-back-button>
      </div>
      <div class="center">Кто платит</div>
    </v-ons-toolbar>

    <v-ons-list>
      <v-ons-list-item
        v-for="(user, index) in users"
        :key="user.id"
        tappable
      >
        <label class="left">
          <v-ons-radio
            :input-id="'radio-' + index"
            :value="user.id"
            v-model=" paidBy"
            @change="commitPaidByToStore(user.id)"
          >
          </v-ons-radio>
        </label>
        <label :for="'radio-' + index" class="left">
          <img :src="user.picture">
        </label>
        <label :for="'radio-' + index" class="center">
          {{ user.name }}
        </label>
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
export default {
  props: {
  },
  data () {
    return {
      paidBy: this.$store.state.payments.paidBy
    }
  },
  computed: {
    users () {
      return this.$store.getters.getMembersByGroupId(+this.$route.params['id'])
    }
  },
  methods: {
    commitPaidByToStore (id) {
      this.$router.go(-1)
      this.$store.commit('updatePaidBy', '' + id + '')
    }
  }
}
</script>

<style scoped>
  img {
    width: 32px;
    border-radius: 50%;
  }
  label {
    margin-bottom: 0;
  }
</style>
