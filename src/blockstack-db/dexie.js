import BlockstackDB from './index'

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
  }
}
