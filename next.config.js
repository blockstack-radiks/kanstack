module.exports = {
  publicRuntimeConfig: {
    radiks: {
      apiServer: process.env.RADIKS_API_URL || 'http://localhost:3000',
    },
  },
  env: {
    RADIKS_API_URL: process.env.RADIKS_API_URL || 'http://localhost:3000',
  },
};
