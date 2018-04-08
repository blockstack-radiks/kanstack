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

db.version(3).stores({
  test: '++id, indexable'
})

db.version(4).stores({
  tasks: '++id, cardId'
})

db.blockstackImport = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.open()
      db.blockstack = new BlockstackDB(db.backendDB(), exportFilename)
      await db.blockstack.import()
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

export default db
