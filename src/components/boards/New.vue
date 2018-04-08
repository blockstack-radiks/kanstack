<template lang="jade">
.container.mt-3
  .row
    .col-md-3.d-none.d-md-block
    .col-md-6.col-xs-12
      .card
        .card-body
          b-form(@submit="save")
            h4 Make a new board
            .form-group.mt-3
              label Name
              input.form-control(v-model="name", placeholder="Give it a cool name")
            .mt-3
            b-button(size="lg", :block="true", type="submit", variant="primary", :disabled="saving") Save
</template>

<script>
import db from '../../db'
import helpers from '../../helpers'
const { colors } = helpers

export default {
  data () {
    return {
      name: '',
      saving: false
    }
  },
  methods: {
    async save () {
      this.saving = true
      const board = {
        name: this.name,
        color: colors[Math.floor(Math.random() * colors.length)]
      }
      board.id = await db.boards.putEncrypted(board)
      db.lists.bulkPutEncrypted([
        {
          name: 'To Do',
          boardId: board.id
        },
        {
          name: 'Doing',
          boardId: board.id
        },
        {
          name: 'Done',
          boardId: board.id
        }
      ])
      this.$router.push({name: 'boards_show', params: { id: board.id }})
      this.saving = false
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
