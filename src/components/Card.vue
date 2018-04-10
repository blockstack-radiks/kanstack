<template lang="jade">
div
  b-modal(ref="modal", :title="card.name", @ok="save")
    .form-group
      label Name
      input.form-control(v-model="card.name")
    p Tasks
    .task.mb-2(v-for="(task, index) in tasks")
      b-form.row(@submit="saveTask(task)")
        .col-8
          div(v-if="task.editing")
            input.form-control(v-model="task.name", :ref="'task-input-'+task.id", autofocus)
          p(v-else)
            | {{ task.name }}
        .col-4.text-right
          div(v-if="task.editing")
            b-button(variant="outline-primary", block, type="submit") Save
          div(v-else)
            span
              font-awesome-icon.ml-2.task-icon.pointer(:icon="pencilIcon", @click="editTask(task)")
            span
              font-awesome-icon.ml-2.mr-2.text-danger.task-icon.pointer(:icon="trashIcon", @click="deleteTask(task, index)")
            b-form-checkbox(v-model="task.completed", @change="saveTaskCompleted(task)")
    b-form.mt-2.mb-2(@submit="addTask", v-if="addingTask")
      .row
        .col-8
          b-form-input.mb-2.mr-auto(v-model="newTaskName", placeholder="Add a Task", autofocus)
        .col-4
          b-button(variant="outline-primary", :block="true", type="submit") Save
    div(v-else)
      b-button(variant="outline-secondary", @click="newTask", ref="newTaskButton") New Task
    p.mt-3 Due Date
    b-form-input.mt-2.mb-2(v-model="dueDate", type="date")
    .form-group
      label.mb-0 Notes
      div(v-bind:class="{ 'd-none': !editingNotes }")
        p.mb-1
          small.text-muted
            | Format your notes using
            a(href="https://simplemde.com/markdown-guide", target="_blank")  Markdown
        textarea.CodeMirror(placeholder="Add some notes", ref="body")
      div(v-if="!editingNotes")
        div(v-html="marked(card.notes)", v-if="card.notes")
        b-button(variant="outline-secondary", @click="() => { editingNotes = true }") Edit Notes
    hr.mt-3.mb-3
    .row
      .col-8
        p.mb-0 Delete this card
        small You cannot undo this action.
      .col-4.text-right
        b-button(variant="danger", @click="confirmDelete") Delete
  div.list-card.mb-3(@click="showModal")
    p {{ card.name }}
    div(v-if="(tasks && tasks.length > 0) || dueDate")
      p
        b-badge(:variant="completed() ? 'success' : 'secondary'", v-if="tasks.length > 0")
          | {{ completedLength() }} / {{ tasks.length }}
        span.small.float-right(v-if="dueDate")
          | due {{ formattedDueDate }}
      .clearfix
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import pencilIcon from '@fortawesome/fontawesome-free-solid/faPencilAlt'
import trashIcon from '@fortawesome/fontawesome-free-regular/faTrashAlt'
import moment from 'moment'
import SimpleMDE from 'simplemde'
import marked from 'marked'

import db from '../db'

export default {
  props: [
    'card',
    'dragging'
  ],
  data () {
    return {
      newTaskName: '',
      pencilIcon,
      addingTask: false,
      trashIcon,
      tasks: this.tasks || [],
      dueDate: null,
      dueDateMoment: null,
      editingNotes: false,
      marked: marked
    }
  },
  components: {
    FontAwesomeIcon
  },
  mounted () {
    if (this.card.dueDate) {
      this.dueDateMoment = moment(this.card.dueDate)
      this.dueDate = this.dueDateMoment.format('YYYY-MM-DD')
    }
    this.fetchTasks()
    this.editor = new SimpleMDE({
      element: this.$refs.body,
      spellChecker: false
    })
    this.editor.value(this.card.notes)
    this.$forceUpdate()
    this.editor.codemirror.on('change', () => {
      const value = this.editor.value()
      this.card.notes = value
    })
    delete this.card.tasks
  },
  watch: {
    dueDate (val) {
      this.dueDateMoment = moment(val)
      this.card.dueDate = this.dueDateMoment.format()
    }
  },
  methods: {
    showModal () {
      this.$refs.modal.show()
    },
    save () {
      this.editingNotes = false
      this.$nextTick(() => {
        db.cards.putEncrypted(this.card)
        this.$forceUpdate()
      })
    },
    newTask () {
      this.addingTask = true
    },
    async addTask () {
      const task = {
        name: this.newTaskName,
        completed: false,
        cardId: this.card.id
      }
      this.tasks.push(task)
      this.newTaskName = ''
      this.addingTask = false
      this.$forceUpdate()
      task.id = await db.tasks.putEncrypted(task)
    },
    completed () {
      return this.completedLength() === this.tasks.length
    },
    completedLength () {
      let completed = 0
      this.tasks.forEach((task) => {
        if (task.completed) {
          completed += 1
        }
      })
      return completed
    },
    async deleteTask (task, index) {
      this.tasks.splice(index, 1)
      await db.tasks.deleteAndExport(task)
      this.$forceUpdate()
    },
    editTask (task) {
      task.editing = true
      this.$forceUpdate()
    },
    saveTask (task) {
      task.editing = false
      this.$forceUpdate()
      db.tasks.putEncrypted(task)
      this.$refs.newTaskButton.focus()
    },
    saveTaskCompleted (task) {
      this.$nextTick(() => {
        db.tasks.putEncrypted(task)
      })
    },
    toggleTaskCompleted (task) {

    },
    confirmDelete () {
      this.$dialog.confirm('Are you sure?').then(async () => {
        this.$refs.modal.hide()
        this.$emit('deleteCard', this.card)
      })
    },
    async fetchTasks () {
      this.tasks = await db.tasks.where('cardId').equals(this.card.id).toDecryptedArray()
    }
  },
  computed: {
    formattedDueDate () {
      if (this.dueDateMoment) {
        const today = moment().startOf('day')
        if (today.isSame(this.dueDateMoment, 'd')) {
          return 'today'
        }
        return this.dueDateMoment.from(today)
      }
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

<style lang="sass">
.datepicker-input
  background-color: #fff !important
</style>
