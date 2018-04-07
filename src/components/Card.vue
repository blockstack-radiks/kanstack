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
    .task(v-for="(task, index) in card.tasks")
      b-form.row(@submit="saveTask(task)")
        .col-8
          div(v-if="task.editing")
            input.form-control(v-model="task.name")
          p(v-else)
            {{ task.name }}
        .col-4.text-right
          div(v-if="task.editing")
            b-button(variant="outline-primary", block, type="submit") Save
          div(v-else)
            span
              font-awesome-icon.ml-2.task-icon.pointer(:icon="pencilIcon", @click="editTask(task)")
            span
              font-awesome-icon.ml-2.mr-2.text-danger.task-icon.pointer(:icon="trashIcon", @click="deleteTask(index)")
            b-form-checkbox(v-model="task.completed", @change="save")
    b-form.mt-2(@submit="addTask", v-if="addingTask")
      .row
        .col-8
          input.form-control.mb-2.mr-auto(v-model="newTaskName", placeholder="Add a Task", autofocus)
        .col-4
          b-button(variant="outline-primary", :block="true", type="submit") Save
    div(v-else)
      b-button.mt-3(variant="outline-secondary", @click="newTask") New Task
    hr.mt-3.mb-3
    .row
      .col-8
        p.mb-0 Delete this card
        small You cannot undo this action.
      .col-4.text-right
        b-button(variant="danger", @click="confirmDelete") Delete
  div.list-card.mb-3(@click="showModal")
    p {{ card.name }}
    div(v-if="card.tasks && card.tasks.length > 0")
      b-badge(:variant="completed() ? 'success' : 'secondary'")
        {{ completedLength() }} / {{ card.tasks.length }}
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import pencilIcon from '@fortawesome/fontawesome-free-solid/faPencilAlt'
import trashIcon from '@fortawesome/fontawesome-free-regular/faTrashAlt'

import db from '../db'

export default {
  props: [
    'card'
  ],
  data () {
    return {
      newTaskName: '',
      pencilIcon,
      addingTask: false,
      trashIcon
    }
  },
  components: {
    FontAwesomeIcon
  },
  mounted () {
    this.card.tasks = this.card.tasks || []
  },
  methods: {
    showModal () {
      this.$refs.modal.show()
    },
    save () {
      this.$nextTick(() => {
        db.cards.putEncrypted(this.card)
        this.$forceUpdate()
      })
    },
    newTask () {
      this.addingTask = true
    },
    addTask () {
      const task = {
        name: this.newTaskName,
        completed: false
      }
      this.card.tasks.push(task)
      this.newTaskName = ''
      this.addingTask = false
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
    },
    deleteTask (index) {
      this.card.tasks.splice(index, 1)
      this.save()
    },
    editTask (task) {
      task.editing = true
      this.$forceUpdate()
    },
    saveTask (task) {
      task.editing = false
      this.save()
    },
    confirmDelete () {
      this.$dialog.confirm('Are you sure?').then(async () => {
        this.$refs.modal.hide()
        this.$emit('deleteCard', this.card)
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.modal-body
  >>> .task
    .task-icon
      position: relative
      top: -7px
      display: none
    &:hover
      .task-icon
        display: inline-block
</style>
