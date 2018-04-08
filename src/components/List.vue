<template lang="jade">
.list-inner
  b-form(v-if="list.editing", @submit="saveList(list)")
    input.form-control.mb-3(v-model="list.name")
    b-button(:block="true", variant="outline-primary", type="submit") Save
  h5(v-else)
    | {{ list.name }}
    font-awesome-icon.ml-2.list-name-edit.d-none(:icon="pencilIcon", @click="editList(list)")
    font-awesome-icon.ml-2.list-name-edit.d-none.text-danger.float-right(:icon="trashIcon", @click="deleteList(list)")
  .mt-3
  vuedraggable.draggable(:list="list.cards", :options="{group: 'cards'}", @change="onSort", @end="sortEnd", @choose="onCardChoose")
    div(v-for="card in list.cards", :key="card.id")
      card(:card="card", @deleteCard="deleteCard", ref="cards", :dragging="dragging")
  div(v-if="list.addingCard")
    b-form(@submit="saveNewCard(list)")
      textarea.form-control.mb-3(v-model="list.newCardName", placeholder="Name", @keyup.esc="cancelAddingCard(list)")
      b-button(variant="outline-primary", type="submit") Save
      b-button.ml-3(variant="outline-secondary", @click="cancelAddingCard(list)") Cancel
  div(v-else)
    b-button(:block="true", variant="outline-secondary", @click="newCard(list)") Add Card
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import pencilIcon from '@fortawesome/fontawesome-free-solid/faPencilAlt'
import trashIcon from '@fortawesome/fontawesome-free-regular/faTrashAlt'
import vuedraggable from 'vuedraggable'

import Card from './card'
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
  mounted () {

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
    async deleteCard (card) {
      await db.cards.delete(card.id)
      await this.fetchCards()
    },
    updateCardsOrder () {
      const { list } = this
      return new Promise(async (resolve, reject) => {
        for (let index = 0; index < list.cards.length; index++) {
          const card = list.cards[index]
          card.order = index
        }
        await db.cards.bulkPutEncrypted(list.cards)
        this.$forceUpdate()
        resolve()
      })
    },
    onCardChoose (event) {
      this.dragging = true
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
