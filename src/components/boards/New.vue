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
            b-button(size="lg", :block="true", type="submit", variant="primary") Save
</template>

<script>
import db from '../../db'

export default {
  data () {
    return {
      name: ''
    }
  },
  methods: {
    async save () {
      const boardId = await db.boards.putEncrypted({
        name: this.name
      })
      this.$router.push({name: 'boards_show', params: { id: boardId }})
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
