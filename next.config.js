module.exports = {
  publicRuntimeConfig: {
    radiks: {
      apiServer: process.env.RADIKS_API_URL || 'http://localhost:3000',
      couchDBName: 'kanstack',
      couchDBUrl: 'http://127.0.0.1:5984',
    },
  },
};
