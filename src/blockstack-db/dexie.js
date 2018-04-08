import BlockstackDB from './index'
const blockstack = require('blockstack')
import { encryptECIES, decryptECIES } from 'blockstack/lib/encryption'
const { loadUserData, getPublicKeyFromPrivate } = blockstack

const getIndexes = (context) => {
  const indexes = [context.schema.primKey.keyPath]
  for (const index of context.schema.indexes) {
    indexes.push(index.keyPath)
  }
  return indexes
}

const decryptObject = (encrypted, privateKey, indexes) => {
  const decrypted = Object.assign({}, encrypted)
  for (const key in encrypted) {
    if (encrypted.hasOwnProperty(key) && indexes.indexOf(key) === -1) {
      const value = encrypted[key]
      decrypted[key] = stringToValue(decryptECIES(privateKey, value))
    }
  }
  return decrypted
}

const encryptObject = (object, publicKey, indexes) => {
  const encrypted = Object.assign({}, object)
  for (const key in object) {
    if (object.hasOwnProperty(key) && indexes.indexOf(key) === -1) {
      const value = object[key]
      const cipher = encryptECIES(publicKey, valueToString(value))
      encrypted[key] = cipher
    }
  }
  return encrypted
}

const valueToString = (value) => {
  if (typeof value === typeof (true)) {
    return value ? 'true' : 'false'
  } else if (typeof value === 'number') {
    return String(value)
  } else {
    return value
  }
}

const stringToValue = (value) => {
  if ((value === 'true') || (value === 'false')) {
    return value === 'true'
  } else if (!isNaN(value)) {
    return parseFloat(value)
  } else {
    return value
  }
}

export default (filename) => {
  return (db) => {
    db.Table.prototype.putAndExport = function (object) {
      return new Promise(async (resolve, reject) => {
        const id = await this.put(object)
        resolve(id)
        const blockstack = new BlockstackDB(db.backendDB(), filename)
        blockstack.export()
      })
    }

    db.Table.prototype.bulkPutAndExport = function (objects) {
      return new Promise(async (resolve, reject) => {
        await this.bulkPut(objects)
        resolve()
        const blockstack = new BlockstackDB(db.backendDB(), filename)
        blockstack.export()
      })
    }

    db.Table.prototype.deleteAndExport = function (object) {
      return new Promise(async (resolve, reject) => {
        await this.delete(object)
        resolve()
        const blockstack = new BlockstackDB(db.backendDB(), filename)
        blockstack.export()
      })
    }

    db.Table.prototype.putEncrypted = function (object) {
      return new Promise(async (resolve, reject) => {
        const privateKey = loadUserData().appPrivateKey
        const publicKey = getPublicKeyFromPrivate(privateKey)
        const indexes = getIndexes(this)
        const encrypted = encryptObject(object, publicKey, indexes)
        const id = this.put(encrypted)
        resolve(id)
        const blockstack = new BlockstackDB(db.backendDB(), filename)
        blockstack.export()
      })
    }

    db.Table.prototype.bulkPutEncrypted = function (objects) {
      return new Promise(async (resolve, reject) => {
        const privateKey = loadUserData().appPrivateKey
        const publicKey = getPublicKeyFromPrivate(privateKey)
        const indexes = getIndexes(this)
        const encrypted = objects.map((object) => {
          return encryptObject(object, publicKey, indexes)
        })
        await this.bulkPut(encrypted)
        resolve()
        const blockstack = new BlockstackDB(db.backendDB(), filename)
        blockstack.export()
      })
    }

    db.Table.prototype.getEncrypted = function (id) {
      return new Promise(async (resolve, reject) => {
        const encrypted = await this.get(id)
        const privateKey = loadUserData().appPrivateKey
        const indexes = getIndexes(this)
        resolve(decryptObject(encrypted, privateKey, indexes))
      })
    }

    db.Collection.prototype.toDecryptedArray = function () {
      return new Promise(async (resolve, reject) => {
        const objects = await this.toArray()
        const privateKey = loadUserData().appPrivateKey
        const indexes = getIndexes(this._ctx.table)
        const decrypted = objects.map((encrypted) => {
          return decryptObject(encrypted, privateKey, indexes)
        })
        resolve(decrypted)
      })
    }

    db.Table.prototype.toDecryptedArray = function () {
      return new Promise(async (resolve, reject) => {
        const objects = await this.toArray()
        const privateKey = loadUserData().appPrivateKey
        const indexes = getIndexes(this)
        const decrypted = objects.map((encrypted) => {
          return decryptObject(encrypted, privateKey, indexes)
        })
        resolve(decrypted)
      })
    }
  }
}
