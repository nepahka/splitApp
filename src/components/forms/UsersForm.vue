<template>
  <f7-page>
    <f7-navbar back-link="Back" title="Новый пользователь">
      <f7-nav-right>
        <f7-link @click="addUser">Добавить</f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-list>
      <f7-list-item>
        <img slot="media" :src="picture">
        <f7-list class="user-form" simple-list>
          <f7-list-item>
            <f7-input
              placeholder="Имя"
              :value="name"
              @input="name = $event.target.value"
              type="text"
              clear-button
            ></f7-input>
          </f7-list-item>
          <f7-list-item>
            <f7-input
              placeholder="Email"
              type="email"
              clear-button
            ></f7-input>
          </f7-list-item>
        </f7-list>
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
export default {
  name: 'UsersForm',
  props: {},
  data () {
    return {
      name: '',
      picture: ''
    }
  },
  computed: {},
  created () {
    this.getPicture()
  },
  methods: {
    async addUser () {
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
      this.$f7.views.main.router.back()
    }
  }
}
</script>

<style scoped lang="scss">
  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
  .user-form {
    margin: 0;

    ul {
      padding-left: 0;
    }
  }
</style>
