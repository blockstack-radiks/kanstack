import getConfig from 'next/config'; // eslint-disable-line import/no-unresolved

const config = () => {
  const { publicRuntimeConfig } = getConfig();
  return publicRuntimeConfig.radiks;
};

export default config;
