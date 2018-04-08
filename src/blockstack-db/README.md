# BlockstackDB

A library of helper functions to use IndexedDB in conjuntion with blockstack encrypted storage.

This library provides two main utilities:

1. IndexedDB Import / Export to Gaia
2. Automatic encryption / decryption of data stored in IndexedDB, using your Blockstack private key.

---

### Why?

Most Blockstack tutorials use a model where data is created as a 'global' javascript object. For example, in the to-do tutorial, the list of tasks is stored in a `todos` object, and every time any task is updated or added, the entire `todos` object is saved as a JSON file on Gaia. When the page is re-loaded, the app fetches and parses this JSON file, and then constructs the Javascript object.

While this approach is sufficient for many simple apps, more complex applications will often need multiple 'tables' of objects, as well as some functional for querying and filtering objects from this data. It would be possible to store each 'table' in it's own JSON file, or even simply store a 'global' datastore object, which contains all of these tables. In addition, filtering could be done in-memory, after loading all the data.

The downsides of this approach are:

1. You need to have duplicated logic for saving and importing each of these tables on page load and whenever any data is updated.
2. In-memory filtering of data would become quite inefficient in an application with a large number of objects.

`IndexedDB` is an in-browser database that solves these problems. It allows you to store multiple tables of data, and you can defined indexable columns in this table to provide complex queries on. This resolves the problem of inefficient queries. In combination with a library like [dexie](http://dexie.org/), your data model can become more simple and elegant.

However, when using `IndexedDB`, your data is only available on the browser your using on a single machine. Real-world apps need to be available on different browsers on multiple machines, and thus this library provides helper methods to asyncronously export your entire database to Gaia in an encrypted file. When the app is re-loaded, this data is fetched from Gaia, decrypted, and bootstrapped into IndexedDB.

Because Blockstack gives you a per-app private key 'for free', it makes sense to use it to encrypt your data on save, and decrypt it on read. Although IndexedDB is only available on your local machine, it is still stored unencrypted on your file system, so you might as well encrypt private data.

---

### IndexedDB Import / Export

If you're using IndexedDB without a library like Dexie, the `BlockstackDB` library provides simple import and export of your entire database.

~~~javascript
const version = 2
const request = window.indexedDB.open("mydb", version)
request.onsuccess = function() {
  const db = request.result
  const blockstackDB = new BlockstackDB(db, 'MyStorageFile.json')
  blockstackDB.import().then(() => {
    // your database has been imported successfully
  })

  // later, after saving data
  blockstackDB.export()
}
~~~

If you're using the Dexie library, it's even easier

~~~javascript
import Dexie from 'dexie'
import BlockstackDB from './blockstack-db'
import BlockstackDexie from './blockstack-db/dexie'

const exportFilename = 'MyStorageFile.json'

const db = new Dexie('kanstack', {
  addons: [ BlockstackDexie(exportFilename) ]
})

db.version(1).stores({
  todos: '++id, completed'
})

// call `blockstackImport` when you load your app
db.blockstackImport = async () => {
  await db.open()
  db.blockstack = new BlockstackDB(db.backendDB(), exportFilename)
  await db.blockstack.import()
  resolve()
}
// when loading your app:
await db.blockstackImport()

// later, save and export your data
// the promise is resolved after data is saved,
// and the export happens afterwards asyncronously
const taskId = await db.todos.putAndExport({
  name: 'My task',
  completed: false
})

// you can also use `bulkPut`
await db.todos.bulkPutAndExport([
  {
    name: 'First',
    completed: false
  },
  {
    name: 'Second',
    completed: true
  }
])

// make sure to export after delete
await db.todos.deleteAndExport(taskId)
~~~

---

### Automatic Encryption / Decryption

When using the `BlockstackAddons` addon for Dexie (as described above), you also get helper methods to automatically encrypt, decrypt, and export your data.

**Note:** only non-indexed fields are encrypted. Otherwise, you would not be able to query your data using indexes. If you really need to query your encrypted data, you'll have to do it in-memory, after loading all objects.

Examples:

~~~javascript
const todo = await db.todos.getEncrypted(id)

const todos = await db.todos.toDecryptedArray()

const todos = await db.todos.where('completed').equals(false).toDecryptedArray()

// export happens by default for all encrypted save operations.
// As with other helper methods, the promise resolves
// after the database operation completes,
// and export happens afterwards asyncronously
const id = await db.todos.putEncrypted({
  name: 'Use BlockstackDB',
  completed: true
})

await db.todos.bulkPutEncrypted([
  {
    name: 'First',
    completed: false
  },
  {
    name: 'Second',
    completed: true
  }
])
~~~

#### Special Notes

Note on encrypting non-strings: Currently, `blockstack.js` only can encrypt strings, buffers, or arrays of strings. That means it does not work with boolean or number values. Special logic is added to automatically convert `true`/`false` to `"true"`/`"false"` before encryption, and back to a boolean on decryption if the value is `"true"`/`"false"`. Similar logic is added for number values, to convert to/from string values.

Note on encryption safety: Currently, `blockstack.js` stores your app private key in `localStorage`, which is also vulnerable to local file system attacks. To ensure safety of your encrypted data, make sure to log out of apps when not using them. When you log out, your private key is removed from `localStorage`, and thus your data cannot be decrypted.
