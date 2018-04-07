<template lang="jade">
b-modal(ref="modal", title="Settings", @ok="save", ok-title="Save")
  .form-group
    label Board Name
    input.form-control(v-model="name")
    hr.mt-3.mb-3
    .row
      .col-8
        p.mb-0 Delete this board
        small You cannot undo this action.
      .col-4.text-right
        b-button(variant="danger", @click="emitDelete") Delete
</template>

<script>
import db from '../../db'

export default {
  props: [
    'board'
  ],
  data () {
    return {
      name: this.board.name
    }
  },
  mounted () {

  },
  methods: {
    show () {
      this.$refs.modal.show()
    },
    save () {
      if (this.name !== this.board.name) {
        const { board } = this
        board.name = this.name
        db.boards.put(board)
        this.$emit('updateName', this.name)
      }
    },
    emitDelete () {
      this.$emit('delete')
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
