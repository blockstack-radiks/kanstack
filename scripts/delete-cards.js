const { getDB } = require('radiks-server');
require('dotenv').config();

const setup = async () => {
  const auth = {
    databaseName: 'kanstack',
    adminUser: process.env.COUCHDB_ADMIN,
    adminPassword: process.env.COUCHDB_PASSWORD,
  };
  const db = getDB(auth);
  const { docs } = await db.find({
    selector: {
      radiksType: 'Card',
    },
  });
  const deletes = docs.map((doc) => {
    console.log(doc);
    return db.remove(doc);
  });
  await Promise.all(deletes);
  // console.log(docs[0]);
};

setup().catch((e) => {
  console.log(e);
}).finally(() => {
  process.exit();
});
