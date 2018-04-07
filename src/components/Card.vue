<template lang="jade">
div
  b-modal(ref="modal", :title="card.name", @ok="save")
    .form-group
      label Name
      input.form-control(v-model="card.name")
    .form-group
      label Notes
      textarea.form-control(v-model="card.notes", placeholder="Describe this card")
    p Tasks
    b-form.mt-2(@submit="addTask")
      .row
        .col-8
          input.form-control.mb-2.mr-auto(v-model="newTaskName", placeholder="Add a Task")
        .col-4
          b-button(variant="outline-primary", :block="true", type="submit") Save
    .row(v-for="task in card.tasks")
      .col-8
        p {{ task.name }}
      .col-4.text-right
        b-form-checkbox(v-model="task.completed", @change="save")
  div.list-card.mb-3(@click="showModal")
    p {{ card.name }}
    div(v-if="card.tasks && card.tasks.length > 0")
      b-badge(:variant="completed() ? 'success' : 'secondary'")
        {{ completedLength() }} / {{ card.tasks.length }}
</template>

<script>
import db from '../db'

export default {
  props: [
    'card'
  ],
  data () {
    return {
      newTaskName: ''
    }
  },
  mounted () {
    this.card.tasks = this.card.tasks || []
  },
  methods: {
    showModal () {
      this.$refs.modal.show()
    },
    save () {
      console.log('Saving card: ', this.card.name)
      db.cards.putAndExport(this.card)
    },
    addTask () {
      const task = {
        name: this.newTaskName,
        completed: false
      }
      this.card.tasks.push(task)
      this.$forceUpdate()
      this.save()
    },
    completed () {
      if (!this.card.tasks) {
        return false
      }
      return this.completedLength() === this.card.tasks.length
    },
    completedLength () {
      let completed = 0
      this.card.tasks.forEach((task) => {
        if (task.completed) {
          completed += 1
        }
      })
      return completed
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
