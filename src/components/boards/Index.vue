<template lang="jade">
.container.mt-3
  .row
    .col-md-4.col-xs-12.mb-3.mt-3(v-for="board in boards")
      .card(:style="{ backgroundColor: boardColor(board, 0.25) }")
        .card-body.text-center
          router-link(:to="{name: 'boards_show', params: { id: board.id }}")
            h4.text-dark{{ board.name }}
</template>

<script>
import db from '../../db'
import helpers from '../../helpers'
const { boardColor } = helpers

export default {
  async mounted () {
    this.boards = await db.boards.toDecryptedArray()
  },
  data () {
    return {
      boards: [],
      boardColor
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
