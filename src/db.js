import Dexie from 'dexie'
import BlockstackDB from './blockstack-db'
import BlockstackDexie from './blockstack-db/dexie'

const exportFilename = 'KanStackDB.json'

const db = new Dexie('kanstack', {
  addons: [ BlockstackDexie(exportFilename) ]
})

db.version(1).stores({
  boards: '++id'
})

db.version(2).stores({
  lists: '++id, boardId',
  cards: '++id, listId'
})

db.open().then(() => {
  db.blockstack = new BlockstackDB(db.backendDB(), exportFilename)
  // Dexie.addons.push()
})

export default db
