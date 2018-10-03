<template>
  <v-ons-list>
    <v-ons-list-item>
      <div class="left">
      </div>
      <div class="center">
        {{ name }}
      </div>
    </v-ons-list-item>
  </v-ons-list>
</template>

<script>
export default {
  props: {
  },
  data () {
    return {}
  },
  computed: {
    name () {
      if (this.$f7router.currentRoute.params.id) {
        return this.$store.getters.getGroupById(this.$f7router.currentRoute.params.id)[0].name
      } else {
        return ''
      }
    }
  }
}
</script>

<style>

</style>
