<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <ons-back-button @click="$router.go(-1)">Назад</ons-back-button>
      </div>
      <div class="center">Сумма</div>
      <div class="right">
        <v-ons-toolbar-button @click="changeSum">
          Готово
        </v-ons-toolbar-button>
      </div>
    </v-ons-toolbar>

    <v-ons-list>
      <v-ons-list-item>
        <div class="center">
          <v-ons-input
            float
            v-model.number="sum"
            type="number"
            placeholder="Введите сумму"
          >
          </v-ons-input>
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
      sum: 0
    }
  },
  computed: {
    paidPies () {
      return this.$store.getters.getPaidPies
    }
  },
  methods: {
    changeSum () {
      this.$emit('isEqually', true)
      this.$store.state.payments.isEqually = false
      this.$store.commit('updatePaidPies', {
        userId: +this.$route.params['userId'],
        sum: this.sum
      })
      this.$router.go(-1)
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
