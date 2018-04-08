<template lang="jade">
.container-fluid.pt-3.h-100.pr-0
  div(v-if="loading")
    .row
      .col-12.text-center.mb-3(v-if="loading")
        h1.mb-3
          font-awesome-icon(:icon="spinnerIcon" pulse)
        h1 Loading ...
  div.h-100(v-else)
    Settings(ref="settings", :board="board", @updateName="updateName", @delete="deleteBoard", :colors="colors", @changeColor="changeColor")
    .row
      .col-12
        h3.pl-3.pr-3
          | {{ board.name }}
          .float-right
            font-awesome-icon.float-right.pointer(:icon="cogsIcon", @click="showSettings")
    .list-row-container.h-100
      .list-row(:style="{ width: listsWidth() }")
        .list(v-for="list in lists", :key="list.id")
          list(:list="list", @delete="deleteList(list)")
        .list.new-list-card
          .list-inner
            div(v-if="addingNewList")
              b-form(@submit="saveNewList")
                input.form-control.mb-3(placeholder="List Name", v-model="newListName", autofocus, @keyup.esc="() => { addingNewList = false }")
                b-button(:block="true", variant="outline-primary", type="submit") Save
            div(v-else)
              b-button(:block="true", variant="outline-primary", @click="newList") Add a List

</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import pencilIcon from '@fortawesome/fontawesome-free-solid/faPencilAlt'
import spinnerIcon from '@fortawesome/fontawesome-free-solid/faSpinner'
import trashIcon from '@fortawesome/fontawesome-free-regular/faTrashAlt'
import cogsIcon from '@fortawesome/fontawesome-free-solid/faCogs'
import vuedraggable from 'vuedraggable'

import db from '../../db'
import Card from '../card'
import List from '../list'
import Settings from './settings'
import helpers from '../../helpers'
const { boardColor, colors } = helpers

export default {
  components: {
    FontAwesomeIcon,
    vuedraggable,
    Card,
    Settings,
    List
  },
  async mounted () {
    this.board = await db.boards.getEncrypted(parseInt(this.$route.params.id))
    this.setBodyStyle()
    this.fetchLists()
  },
  beforeDestroy () {
    document.querySelector('nav').style.backgroundColor = null
    document.body.style.backgroundColor = null
  },
  data () {
    return {
      loading: true,
      board: null,
      lists: [],
      pencilIcon: pencilIcon,
      addingNewList: false,
      newListName: '',
      spinnerIcon,
      trashIcon,
      cogsIcon,
      colors
    }
  },
  methods: {
    newList () {
      this.addingNewList = true
    },
    async saveNewList () {
      const list = { name: this.newListName, boardId: this.board.id }
      this.addingNewList = false
      this.newListName = ''
      this.lists.push(list)
      list.id = await db.lists.putEncrypted(list)
    },
    async fetchLists () {
      this.lists = await db.lists.where('boardId').equals(this.board.id).toDecryptedArray()
      this.loading = false
      this.$forceUpdate()
    },
    listsWidth () {
      return `${(this.lists.length + 1) * 320}px`
    },
    deleteList (list) {
      this.$dialog.confirm('Are you sure you want to delete this list?').then(() => {
        db.lists.deleteAndExport(list.id)
        this.fetchLists()
      })
    },
    showSettings () {
      this.$refs.settings.show()
    },
    updateName (name) {
      this.board.name = name
    },
    async deleteBoard () {
      this.$dialog.confirm('Are you sure you want to delete this board? All items will be lost.').then(async () => {
        await db.boards.deleteAndExport(this.board.id)
        db.blockstack.export()
        this.$router.push('/')
      })
    },
    changeColor (color) {
      this.board.color = color
      db.boards.putEncrypted(this.board)
      this.setBodyStyle()
    },
    setBodyStyle () {
      document.querySelector('nav').style.setProperty('background-color', boardColor(this.board, 0.5), 'important')
      document.body.style.backgroundColor = boardColor(this.board, 0.25)
    },
    cancelAddingCard (list) {
      list.addingCard = false
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="sass">
.list-row-container
  overflow-x: scroll
  // padding-bottom: 100px
  padding-left: 5px

.list
  width: 300px
  margin-right: 15px
  display: inline-flex
  position: relative
  border: 1px solid rgba(0, 0, 0, 0.125)
  border-radius: 0.25rem
  background-color: #efefef
  box-shadow: 0 0 1px #868686

  .list-inner
    width: 100%
    padding: 15px

  &:hover
    .list-name-edit
      display: inline-block !important
      cursor: pointer

.new-list-card
  top: 5px

.list-card
  border: 1px solid rgba(0, 0, 0, 0.125)
  border-radius: 0.25rem
  padding: 10px
  cursor: pointer
  background-color: white
  p
    margin: 0

.draggable
  min-height: 10px
</style>
