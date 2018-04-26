# Blockstack Kanban board App

A Kanban board app built on Blockstack.

- Client-side encryption
- Offline support with IndexedDB
- Automatic encryption / decryption of data in IndexedDB
- Automatic import / export of IndexedDB data to Blockstack storage.

To learn more about integrating Blockstack encryption and storage with IndexedDB, [check out the documentation](./src/blockstack-db/README.md).

## Build Setup

``` bash
# install dependencies
# previously we used yarn install. This is no longer supported.
npm install

# serve with hot reload at localhost:8000
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

```

After running `npm run dev`, you can visit the app in [`locahost:8000`](http://localhost:8000).

