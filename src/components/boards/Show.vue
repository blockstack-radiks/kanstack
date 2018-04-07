<template lang="jade">
.container-fluid.mt-3
  div(v-if="loading")
    .row
      .col-12.text-center.mb-3(v-if="loading")
        h1.mb-3
          font-awesome-icon(:icon="spinnerIcon" pulse)
        h1 Loading ...
  div(v-else)
    Settings(ref="settings", :board="board", @updateName="updateName")
    .row
      .col-12
        h3
          {{ board.name }}
          .float-right
            font-awesome-icon.float-right.pointer(:icon="cogsIcon", @click="showSettings")
    .list-row-container
      .list-row(:style="{ width: listsWidth() }")
        .list(v-for="list in lists")
          .list-inner
            div(v-if="list.editing")
              input.form-control.mb-3(v-model="list.name")
              b-button(:block="true", variant="outline-primary", @click="saveList(list)") Save
            h5(v-else)
              {{ list.name }}
              font-awesome-icon.ml-2.list-name-edit.d-none(:icon="pencilIcon", @click="editList(list)")
              font-awesome-icon.ml-2.list-name-edit.d-none.text-danger.float-right(:icon="trashIcon", @click="deleteList(list)")
            .mt-3
            vuedraggable.draggable(v-model="list.cards", :options="{group: 'cards'}", @change="(evt) => { onSort(list, evt) }")
              .list-card.mb-3(v-for="card in list.cards")
                card(:card="card")
            div(v-if="list.addingCard")
              input.form-control.mb-3(v-model="list.newCardName", placeholder="Name")
              b-button(:block="true", variant="outline-primary", @click="saveNewCard(list)") Save
            div(v-else)
              b-button(:block="true", variant="outline-secondary", @click="newCard(list)") Add Card

        .list.new-list-card
          .list-inner
            div(v-if="addingNewList")
              input.form-control.mb-3(placeholder="List Name", v-model="newListName")
              b-button(:block="true", variant="outline-primary", @click="saveNewList") Save
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

import _ from 'underscore'

import db from '../../db'
import Card from '../card'
import Settings from './settings'

export default {
  components: {
    FontAwesomeIcon,
    vuedraggable,
    Card,
    Settings
  },
  async mounted () {
    this.board = await db.boards.get(parseInt(this.$route.params.id))
    this.fetchLists()
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
      cogsIcon
    }
  },
  methods: {
    newList () {
      this.addingNewList = true
    },
    async saveNewList () {
      await db.lists.add({name: this.newListName, boardId: this.board.id})
      this.addingNewList = false
      this.newListName = ''
      this.fetchLists()
    },
    async fetchLists () {
      this.lists = await db.lists.where('boardId').equals(this.board.id).toArray()
      await this.fetchCards()
      this.loading = false
    },
    async fetchCards () {
      if (this.lists.length === 0) {
        return true
      }
      return new Promise((resolve, reject) => {
        _.each(this.lists, async (list, index, lists) => {
          list.cards = _.sortBy(await db.cards.where('listId').equals(list.id).toArray(), (card) => {
            return card.order
          })
          if (index === lists.length - 1) {
            resolve()
          }
        })
      })
    },
    editList (list) {
      list.editing = true
      this.$forceUpdate()
    },
    saveList (list) {
      list.editing = false
      this.$forceUpdate()
      db.lists.putAndExport(list)
    },
    newCard (list) {
      list.addingCard = true
      list.newCardName = ''
      this.$forceUpdate()
    },
    async saveNewCard (list) {
      list.addingCard = false
      const card = {
        name: list.newCardName,
        listId: list.id
      }
      list.cards.push(card)
      this.$forceUpdate()
      card.id = await db.cards.putAndExport(card)
    },
    listsWidth () {
      return `${(this.lists.length + 1) * 320}px`
    },
    deleteList (list) {
      db.lists.delete(list.id)
      this.fetchLists()
    },
    updateCardsOrder (list) {
      console.log('updating list', list)
      return new Promise((resolve, reject) => {
        for (let index = 0; index < list.cards.length; index++) {
          const card = list.cards[index]
          card.order = index
        }
        db.cards.bulkPut(list.cards)
        resolve()
      })
    },
    async onSort (list, event) {
      console.log(list, event)
      if (event.added) {
        const card = event.added.element
        card.listId = list.id
        await db.cards.putAndExport(card)
        await this.updateCardsOrder(list)
      } else if (event.removed) {

      } else if (event.moved) {
        await this.updateCardsOrder(list)
      }
      this.$forceUpdate()
      console.log(list, event)
    },
    showSettings () {
      console.log('settings')
      this.$refs.settings.show()
    },
    updateName (name) {
      this.board.name = name
    }
  }
}
</script>

<style lang="sass">
.list-row-container
  overflow-x: scroll
  padding-bottom: 200px

.list
  width: 300px
  margin-right: 15px
  display: inline-flex
  position: relative
  border: 1px solid rgba(0, 0, 0, 0.125)
  border-radius: 0.25rem

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
  p
    margin: 0

.draggable
  min-height: 10px
</style>
