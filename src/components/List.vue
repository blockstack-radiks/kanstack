<template lang="jade">
.list-inner
  b-form(v-if="list.editing", @submit="saveList(list)")
    input.form-control.mb-3(v-model="list.name")
    b-button(:block="true", variant="outline-primary", type="submit") Save
  h5(v-else)
    | {{ list.name }}
    font-awesome-icon.ml-2.list-name-edit.d-none(:icon="pencilIcon", @click="editList()")
    font-awesome-icon.ml-2.list-name-edit.d-none.text-danger.float-right(:icon="trashIcon", @click="deleteList()")
  .mt-3
  vuedraggable.draggable(:list="cards", :options="{group: 'cards'}", @change="onSort", @end="sortEnd", @start="onCardChoose")
    div(v-for="card in cards", :key="card.id")
      card(:card="card", @deleteCard="deleteCard", ref="cards", :dragging="dragging")
  div(v-if="list.addingCard")
    b-form(@submit="saveNewCard()")
      textarea.form-control.mb-3(v-model="list.newCardName", placeholder="Name", @keyup.esc="cancelAddingCard()", @keyup.enter="saveNewCard()")
      b-button(variant="outline-primary", type="submit") Save
      b-button.ml-3(variant="outline-secondary", @click="cancelAddingCard()") Cancel
  div(v-else)
    b-button(:block="true", variant="outline-secondary", @click="newCard()") Add Card
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import pencilIcon from '@fortawesome/fontawesome-free-solid/faPencilAlt'
import trashIcon from '@fortawesome/fontawesome-free-regular/faTrashAlt'
import vuedraggable from 'vuedraggable'
import _ from 'underscore'

import Card from './Card'
import db from '../db'

export default {
  props: [
    'list'
  ],
  components: {
    Card,
    vuedraggable,
    FontAwesomeIcon
  },
  data () {
    return {
      pencilIcon,
      trashIcon,
      cards: [],
      dragging: false
    }
  },
  async mounted () {
    await this.fetchCards()
  },
  methods: {
    async onSort (event) {
      const { list } = this
      if (event.added) {
        this.$nextTick(async () => {
          const card = event.added.element
          card.listId = list.id
          await db.cards.putEncrypted(card)
          this.updateCardsOrder()
        })
      } else if (event.removed) {

      } else if (event.moved) {
        this.updateCardsOrder()
      }
      this.$forceUpdate()
    },
    sortEnd () {
      this.dragging = false
    },
    editList () {
      const { list } = this
      list.editing = true
      this.$forceUpdate()
    },
    saveList () {
      const { list } = this
      list.editing = false
      this.$forceUpdate()
      db.lists.putEncrypted(list)
    },
    newCard () {
      const { list } = this
      list.addingCard = true
      list.newCardName = ''
      this.$forceUpdate()
    },
    async saveNewCard () {
      const { list } = this
      list.addingCard = false
      const card = {
        name: list.newCardName,
        listId: list.id
      }
      card.id = await db.cards.putEncrypted(card)
      this.cards.push(card)
      this.$forceUpdate()
    },
    async deleteCard (card) {
      await db.cards.deleteAndExport(card.id)
      await this.fetchCards()
    },
    async fetchCards () {
      return new Promise(async (resolve, reject) => {
        const cards = await db.cards.where('listId').equals(this.list.id).toDecryptedArray()
        this.cards = _.sortBy(cards, (card) => {
          return card.order
        })
        resolve()
      })
    },
    updateCardsOrder () {
      return new Promise(async (resolve, reject) => {
        for (let index = 0; index < this.cards.length; index++) {
          const card = this.cards[index]
          card.order = index
        }
        await db.cards.bulkPutEncrypted(this.cards)
        this.$forceUpdate()
        resolve()
      })
    },
    onCardChoose (event) {
      console.log('choose')
      this.dragging = true
    },
    deleteList () {
      this.$emit('delete')
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
