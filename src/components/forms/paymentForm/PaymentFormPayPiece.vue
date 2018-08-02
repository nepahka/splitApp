<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <ons-back-button>Назад</ons-back-button>
      </div>
      <div class="center">USER</div>
    </v-ons-toolbar>
    <v-ons-list>
      <v-ons-list-item>
        <div class="center">
          <v-ons-input
            float
            placeholder="Сумма"
            type="number"
            v-model="sum"
            @click.stop=""
          ></v-ons-input>
        </div>
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
      return this.$store.getters.getMembersByGroupId(this.$route.params['id'])
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
