const config = () => ({
  apiServer: process.env.RADIKS_API_URL || 'http://localhost:3000',
});

export default config;
