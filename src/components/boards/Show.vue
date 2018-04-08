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
          {{ board.name }}
          .float-right
            font-awesome-icon.float-right.pointer(:icon="cogsIcon", @click="showSettings")
    .list-row-container.h-100
      .list-row(:style="{ width: listsWidth() }")
        .list(v-for="list in lists")
          .list-inner
            b-form(v-if="list.editing", @submit="saveList(list)")
              input.form-control.mb-3(v-model="list.name")
              b-button(:block="true", variant="outline-primary", type="submit") Save
            h5(v-else)
              {{ list.name }}
              font-awesome-icon.ml-2.list-name-edit.d-none(:icon="pencilIcon", @click="editList(list)")
              font-awesome-icon.ml-2.list-name-edit.d-none.text-danger.float-right(:icon="trashIcon", @click="deleteList(list)")
            .mt-3
            vuedraggable.draggable(v-model="list.cards", :options="{group: 'cards'}", @change="(evt) => { onSort(list, evt) }")
              div(v-for="card in list.cards")
                card(:card="card", @deleteCard="deleteCard")
            div(v-if="list.addingCard")
              b-form(@submit="saveNewCard(list)")
                input.form-control.mb-3(v-model="list.newCardName", placeholder="Name", @keyup.esc="() => { cancelAddingCard(list) }")
                b-button(:block="true", variant="outline-primary", type="submit") Save
            div(v-else)
              b-button(:block="true", variant="outline-secondary", @click="newCard(list)") Add Card

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

import _ from 'underscore'

import db from '../../db'
import Card from '../card'
import Settings from './settings'
import helpers from '../../helpers'
const { boardColor, colors } = helpers

export default {
  components: {
    FontAwesomeIcon,
    vuedraggable,
    Card,
    Settings
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
      await this.fetchCards()
      this.loading = false
      this.$forceUpdate()
    },
    async fetchCards () {
      if (this.lists.length === 0) {
        return true
      }
      return new Promise((resolve, reject) => {
        _.each(this.lists, async (list, index, lists) => {
          const cards = await db.cards.where('listId').equals(list.id).toDecryptedArray()
          list.cards = _.sortBy(cards, (card) => {
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
      db.lists.putEncrypted(list)
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
      card.id = await db.cards.putEncrypted(card)
    },
    listsWidth () {
      return `${(this.lists.length + 1) * 320}px`
    },
    deleteList (list) {
      this.$dialog.confirm('Are you sure you want to delete this list?').then(() => {
        db.lists.delete(list.id)
        this.fetchLists()
      })
    },
    async deleteCard (card) {
      await db.cards.delete(card.id)
      await this.fetchCards()
    },
    updateCardsOrder (list) {
      return new Promise(async (resolve, reject) => {
        for (let index = 0; index < list.cards.length; index++) {
          const card = list.cards[index]
          card.order = index
        }
        await db.cards.bulkPutEncrypted(list.cards)
        resolve()
      })
    },
    async onSort (list, event) {
      if (event.added) {
        const card = event.added.element
        card.listId = list.id
        await db.cards.putEncrypted(card)
        await this.updateCardsOrder(list)
      } else if (event.removed) {

      } else if (event.moved) {
        await this.updateCardsOrder(list)
      }
      this.$forceUpdate()
    },
    showSettings () {
      this.$refs.settings.show()
    },
    updateName (name) {
      this.board.name = name
    },
    async deleteBoard () {
      this.$dialog.confirm('Are you sure you want to delete this board? All items will be lost.').then(async () => {
        await db.boards.delete(this.board.id)
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
