<template>
  <v-ons-alert-dialog modifier="rowfooter" :visible.sync="isVisible">
    <span slot="title">Списать долг</span>
    {{ user.who.name }} перед {{ user.whom.name }}?
    <template slot="footer">
      <v-ons-alert-dialog-button  @click="onCancel">Нет</v-ons-alert-dialog-button>
      <v-ons-alert-dialog-button @click="onConfirm">Да</v-ons-alert-dialog-button>
    </template>
  </v-ons-alert-dialog>
</template>

<script>
export default {
  props: {
    user: Object
  },
  data () {
    return {
      isVisible: true
    }
  },
  methods: {
    onCancel () {
      this.$emit('onCancel')
    },
    onConfirm () {
      this.$emit('onConfirm')
    }
  }
}
</script>

<style>
  .modal {
    display: block;
  }
</style>
