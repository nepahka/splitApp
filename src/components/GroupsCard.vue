<template>
  <div class="card">
    <div class="card_header">
      <h3>Группы</h3>
    </div>
    <div class="card_body">
      <div
        v-for="group in groups"
        :key="group.id"
        class="alert alert-secondary group"
      >
        <div class="group-name">
          {{ group.name }}
        </div>
        <div class="group-members">
          <img v-for="member in group.members" :src="member.picture">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    groups: {
      type: Array,
      default () {
        return {}
      }
    }
  },
  data () {
    return {}
  },
  computed: {
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
