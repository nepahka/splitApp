<template>
  <f7-page>
    <f7-navbar back-link="Back" title="Новая группа">
        <f7-nav-right>
          <f7-link @click="addGroup">Добавить</f7-link>
        </f7-nav-right>
    </f7-navbar>
    <f7-list inline-labels no-hairlines-md>
      <f7-list-item>
        <f7-label>Имя</f7-label>
        <f7-input
          :value="name"
          type="text"
          @input="name = $event.target.value"
          placeholder="Имя группы"
          clear-button
        ></f7-input>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item
        checkbox
        v-for="user in users"
        :key="user.id"
        @click="toggleCheckbox(user)"
        :title="user.name"
      >
        <!--<f7-checkbox-->
          <!--:input-id="'members-' + index"-->
          <!--:value="user.id"-->
          <!--:checked="isSelected(user)"-->
        <!--&gt;-->
        <!--</f7-checkbox>-->
        <img slot="media" :src="user.picture">
      </f7-list-item>
    </f7-list>
    <f7-block-footer>
      <f7-link @click="$f7.views.main.router.navigate({url: '/adduser/'})">Добавить пользователя</f7-link>
    </f7-block-footer>
  </f7-page>
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
      this.$f7.views.main.router.back()
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
