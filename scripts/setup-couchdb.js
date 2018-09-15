const { setupDB } = require('radiks-server');
require('dotenv').config();

const setup = async () => {
  await setupDB({
    databaseName: 'kanstack',
    adminUser: process.env.COUCHDB_ADMIN,
    adminPassword: process.env.COUCHDB_PASSWORD,
  });
};

setup().catch((e) => {
  console.log(e);
}).finally(() => {
  process.exit();
});
