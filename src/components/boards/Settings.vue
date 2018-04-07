<template lang="jade">
b-modal(ref="modal", title="Settings", @ok="save", ok-title="Save")
  .form-group
    label Board Name
    input.form-control(v-model="name")
    .mt-3
    p Background Color
    div.color-container(v-for="color in colors")
      .color(:style="{ backgroundColor: color }", @click="setColor(color)")
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
    'board',
    'colors'
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
        db.boards.putEncrypted(board)
        this.$emit('updateName', this.name)
      }
    },
    emitDelete () {
      this.$emit('delete')
    },
    setColor (color) {
      this.$emit('changeColor', color)
    }
  }
}
</script>

<style lang="sass" scoped>
.color-container
  display: inline-block
  margin-right: 5px
  cursor: pointer
  .color
    width: 30px
    height: 30px
    border-radius: 2px
</style>
