<template>
  <div class="card">
    <h1 class="display-4 center">Add User</h1>
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
    <hr>
    <button
      type="button"
      class="btn btn-success"
      @click="addUser"
    >
      Add
    </button>
  </div>
</template>

<script>
export default {
  name: 'UsersForm',
  props: {
    users: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      name: ''
    }
  },
  computed: {
  },
  methods: {
    addUser () {
      this.getUserPicture()
        .then((response) => {
          return response.json()
        })
        .then(({results}) => {
          this.$emit('addUser', this.name, results[0].picture.thumbnail)
        })
        .catch(alert)
    },
    getUserPicture () {
      return fetch('https://api.randomuser.me/?lego')
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
</style>
