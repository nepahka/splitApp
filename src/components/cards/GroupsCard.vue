<template>
  <div class="card">
    <div class="card_header">
      <h3>Группы</h3>
      <button
        type="button"
        class="btn btn-primary"
        @click="showGroupsModal"
      >
        Add group
      </button>
    </div>
    <div class="card_body">
      <div
        v-for="group in groups"
        :key="group.id"
        class="alert alert-secondary group"
        @click="openGroup(group.id)"
      >
        <div class="group-name">
          {{ group.name }}
          {{ group.balance }}
          {{ group.id }}
        </div>
        <div class="group-members">
          <img v-for="member in members(group.id)" :src="member.picture">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    groups: Array
  },
  data () {
    return {}
  },
  computed: {
  },
  methods: {
    members (id) {
      return this.$store.getters.getMembersByGroupId(id)
    },
    showGroupsModal () {
      this.$emit('showGroupsModal', true)
    },
    openGroup (id) {
      this.$router.push('/groups/' + id)
    }
  }
}
</script>

<style>
  .group {
    display: flex;
    align-items: center;
  }

  .group-members {
    margin-left: auto;
  }

  .group-members img {
    margin-right: 0;
  }

  .group-members img ~ img {
    margin-left: 12px;
  }
</style>
