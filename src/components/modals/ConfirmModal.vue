<template>
  <div class="confirm-modal modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Списать долг</h5>
        </div>
        <div class="modal-body">
          <div class="confirm-modal__text">Вы хотите списать долг <b>{{ user.who.name }}</b> перед <b>{{ user.whom.name }}</b>?   </div>
        </div>
        <div class="modal-footer">
          <button class="confirm-modal__btn confirm-modal__btn--cancel btn btn-secondary" @click="onCancel">Нет</button>
          <button class="confirm-modal__btn confirm-modal__btn--confirm btn btn-primary" @click="onConfirm">Да</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: Object
  },
  data () {
    return {

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
