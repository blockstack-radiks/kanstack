const blockstack = require('blockstack')

export default class BlockstackDB {
  constructor (db, filename) {
    this.db = db
    this.filename = filename
  }

  export () {
    return new Promise(async (resolve, reject) => {
      const data = await this.createExportData()
      try {
        await blockstack.putFile(this.filename, JSON.stringify(data), { encrypt: true })
        resolve(data)
      } catch (error) {
        reject(error)
      }
    })
  }

  import () {
    const { db } = this
    return new Promise(async (resolve, reject) => {
      try {
        const data = await this.fetchImportData()
        if (!data || Object.keys(data).length === 0) {
          return resolve()
        }
        const transaction = db.transaction(db.objectStoreNames, 'readwrite')

        transaction.onerror = (event) => {
          reject(event)
        }

        for (const storeIndex in db.objectStoreNames) {
          if (!db.objectStoreNames.hasOwnProperty(storeIndex)) {
            continue
          }
          const store = db.objectStoreNames[storeIndex]
          let addedCount = 0
          if (!data[store] || data[store].length === 0) {
            delete data[store]
            if (Object.keys(data).length === 0) {
              resolve()
            }
            continue
          }
          for (const object of data[store]) {
            const request = transaction.objectStore(store).put(object)
            request.onsuccess = (event) => {
              addedCount += 1
              if (addedCount === data[store].length) {
                delete data[store]
                if (Object.keys(data).length === 0) {
                  resolve()
                }
              }
            }
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  fetchImportData () {
    return new Promise(async (resolve, reject) => {
      try {
        const json = await blockstack.getFile(this.filename, { decrypt: true })
        const data = JSON.parse(json)
        resolve(data)
      } catch (error) {
        reject(error)
      }
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
