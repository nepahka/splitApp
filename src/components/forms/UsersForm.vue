<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <ons-back-button>Назад</ons-back-button>
      </div>
      <div class="center">Новый пользователь</div>
      <div class="right">
        <v-ons-toolbar-button @click="addUser">
          Готово
        </v-ons-toolbar-button>
      </div>
    </v-ons-toolbar>
    <v-ons-list>
      <v-ons-list-item>
        <div class="left">
          <img :src="picture">
        </div>
        <div class="center">
          <v-ons-list modifier="noborder">
            <v-ons-list-item>
              <v-ons-input
                placeholder="Имя"
                float
                v-model="name"
                type="text"
              ></v-ons-input>
            </v-ons-list-item>
            <v-ons-list-item>
              <v-ons-input
                placeholder="Email"
                float
                type="text"
              ></v-ons-input>
            </v-ons-list-item>
          </v-ons-list>
        </div>
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
export default {
  name: 'UsersForm',
  props: {
  },
  data () {
    return {
      name: '',
      picture: ''
    }
  },
  computed: {
  },
  created () {
    this.getPicture()
  },
  methods: {
    async addUser () {
      this.$router.push({ name: this.$route.matched[this.$route.matched.length - 2].name })
      await this.createUser()
    },
    async getPicture () {
      const response = await fetch('https://api.randomuser.me/?lego')
      const picture = await response.json()
      this.picture = picture.results[0].picture.thumbnail
    },
    createUser () {
      this.$store.dispatch('createUser', {
        name: this.name,
        picture: this.picture
      })
    }
  }
}
</script>

<style scoped>
  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
</style>
