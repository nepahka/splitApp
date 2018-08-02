<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <ons-back-button>Назад</ons-back-button>
      </div>
      <div class="center">Новая группа</div>
      <div class="right">
        <v-ons-toolbar-button @click="addGroup">
          Готово
        </v-ons-toolbar-button>
      </div>
    </v-ons-toolbar>
    <br>
    <v-ons-list-title>Имя</v-ons-list-title>
    <v-ons-list>
      <v-ons-list-item>
        <v-ons-input
          v-model="name"
          float
          type="text"
          placeholder="Имя"
        ></v-ons-input>
      </v-ons-list-item>
    </v-ons-list>
    <br>
    <v-ons-list-title>Члены</v-ons-list-title>
    <v-ons-list>
      <v-ons-list-item
        v-for="(user, index) in users"
        :key="user.id"
        @click="toggleCheckbox(user)"
      >
        <div class="left">
          <img :src="user.picture">
        </div>
        <div class="center">
          {{ user.name }}
        </div>
        <div class="right list-item__right">
          <v-ons-checkbox
            :input-id="'members-' + index"
            :value="user.id"
            :checked="isSelected(user)"
          >
          </v-ons-checkbox>
        </div>
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
export default {
  name: 'GroupsForm',
  props: {},
  data () {
    return {
      name: '',
      members: []
    }
  },
  computed: {
    users () {
      return this.$store.getters.getUsers
    },
    groups () {
      return this.$store.getters.getGroups
    }
  },
  methods: {
    async addGroup () {
      let resultMembers = []
      this.members.map(uID => {
        resultMembers.push(
          {
            id: uID,
            debtors: {},
            balance: 0
          })
      })
      await this.$store.dispatch('createGroup', {
        name: this.name,
        members: resultMembers
      })

      const gID = this.groups[this.groups.length - 1].id

      this.members.map(uID => {
        this.$store.dispatch('createConnection', {
          groupId: gID,
          userId: uID
        })
      })
      this.$router.push({ name: this.$route.matched[this.$route.matched.length - 2].name })
    },
    toggleCheckbox (user) {
      if (this.members.includes(user.id)) {
        this.members.splice(this.members.findIndex(u => u === user.id), 1)
      } else {
        this.members.push(user.id)
      }
    },
    isSelected (user) {
      return this.members.includes(user.id)
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
