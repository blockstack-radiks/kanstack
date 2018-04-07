const blockstack = require('blockstack')

export default class BlockstackDB {
  constructor (db, filename) {
    this.db = db
    this.filename = filename
  }

  async export () {
    return new Promise(async (resolve, reject) => {
      const data = await this.createExportData()
      await blockstack.putFile(this.filename, JSON.stringify(data), { encrypt: true })
      resolve(data)
    })
  }

  async import () {
    return new Promise(async (resolve, reject) => {
      const json = await blockstack.getFile(this.filename, { decrypt: true })
      const data = JSON.parse(json)
      resolve(data)
    })
  }

  createExportData () {
    const { db } = this
    return new Promise((resolve, reject) => {
      const exportObject = {}
      if (db.objectStoreNames.length === 0) {
        resolve(exportObject)
        return
      }

      const transaction = db.transaction(db.objectStoreNames, 'readonly')
      transaction.onerror = function (event) {
        reject(event)
      }

      for (const storeIndex in db.objectStoreNames) {
        if (!db.objectStoreNames.hasOwnProperty(storeIndex)) {
          continue
        }
        const store = db.objectStoreNames[storeIndex]
        const objects = []
        transaction.objectStore(store).openCursor().onsuccess = (event) => {
          const cursor = event.target.result
          if (cursor) {
            objects.push(cursor.value)
            cursor.continue()
          } else {
            exportObject[store] = objects
            if (db.objectStoreNames.length === Object.keys(exportObject).length) {
              resolve(exportObject)
            }
          }
        }
      }
    })
  }
}
