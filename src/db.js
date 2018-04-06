import Dexie from 'dexie'

const db = new Dexie('kanstack')

db.version(1).stores({
  boards: '++id'
})

db.version(2).stores({
  lists: '++id, boardId',
  cards: '++id, listId'
})

export default db
