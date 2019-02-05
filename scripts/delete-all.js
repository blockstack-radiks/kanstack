const { getDB } = require('radiks-server');
require('dotenv').config();

const deleteAll = async (db, type) => {
  const { docs } = await db.find({
    selector: {
      radiksType: type,
    },
  });
  return docs.map(doc => db.remove(doc));
};

const setup = async () => {
  const auth = {
    databaseName: 'kanstack',
    adminUser: process.env.COUCHDB_ADMIN,
    adminPassword: process.env.COUCHDB_PASSWORD,
  };
  const db = getDB(auth);
  await Promise.all(await deleteAll(db, 'Board'));
  await Promise.all(await deleteAll(db, 'Card'));
  await Promise.all(await deleteAll(db, 'GroupMembership'));
  await Promise.all(await deleteAll(db, 'GroupInvitation'));
  await Promise.all(await deleteAll(db, 'UserGroup'));
  await Promise.all(await deleteAll(db, 'BlockstackUser'));
};

setup().catch((e) => {
  console.log(e);
}).finally(() => {
  process.exit();
});
