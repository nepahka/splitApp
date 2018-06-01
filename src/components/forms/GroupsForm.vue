<template>
  <div class="card">
    <h1 class="display-4 center">Add Group</h1>
    <hr>
    <div class="form-group">
      <label>Name</label>
      <input
        v-model="name"
        class="form-control"
        type="text"
        placeholder="Name"
      >
    </div>
    <div class="form-group">
      <label>Paid to</label>
      <div
        v-for="(user, index) in users"
        :key="user.id"
        class="user-item"
        @click="toggleCheckbox(user)"
      >
        <div class="user-item__checkbox">
          <label
            :for="'members-' + index"
            class="form-check-label"
          >
            <input
              :id="'members-' + index"
              :value="user.id"
              :checked="isSelected(user)"
              type="checkbox"
            >
          </label>
        </div>
        <div class="user-item__img">
          <img
            :src="user.picture"
          >
        </div>
        <div class="user-item__name">
          {{ user.name }}
        </div>
      </div>
    </div>
    <hr>
    <button
      type="button"
      class="btn btn-success"
      @click="addGroup"
    >
      Add
    </button>
  </div>
</template>

<script>
export default {
  name: 'GroupsForm',
  props: {
  },
  data () {
    return {
      name: '',
      members: []
    }
  },
  computed: {
    users () {
      return this.$store.getters.getUsers
    }
  },
  methods: {
    addGroup () {
      this.$store.dispatch('createGroup', {
        name: this.name,
        members: this.members
      })
      // спорный момент
      const id = this.$store.getters.getGroups.length + 1
      this.members.map(uID => {
        this.$store.dispatch('createConnection', {
          groupId: id,
          userId: uID
        })
      })
      this.$emit('addGroup')
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
  .card {
    position: fixed;
    transform: translate(-50%, -50%);
    width: 32rem;
    padding: 30px;
    text-align: left;
    top: 50%;
    left: 50%;
    z-index: 1;
  }

  label {
    font-size: 20px;
  }

  .center {
    text-align: center;
  }

  .user-item {
    display: flex;
    align-items: center;
    height: 40px;
  }
  .user-item ~ .user-item {
    border-top: 1px solid #eee;
  }
  .user-item__img {
    width: 32px;
    height: 32px;
    margin-right: 12px;
    margin-left: 12px;
    border-radius: 50%;
    overflow: hidden;
  }
  .user-item__img img {
    width: inherit;
    height: inherit;
  }
  .user-item__checkbox {
    position: relative;
    top: -3px;
  }
  .user-item__name {

  }
  .user-item__debt-input {
    width: 80px;
    text-align: right;
    border: none;
    margin-left: auto;
    height: 39px;
    outline: none;
    padding: 0;
  }
</style>
