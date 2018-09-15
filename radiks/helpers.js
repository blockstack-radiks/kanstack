import * as blockstack from 'blockstack';
import { signECDSA } from 'blockstack/lib/encryption';

import { sendLoginSignedMessage } from './api';

const valueToString = (value) => {
  if (typeof value === typeof (true)) {
    return value ? 'true' : 'false';
  } if (typeof value === 'number') {
    return String(value);
  }
  return value;
};

const stringToValue = (value, definition) => {
  if (definition.stringType === 'boolean') {
    return value === 'true';
  }
  if (definition.stringType === 'number') {
    return parseFloat(value);
  }
  return value;
};

export const decryptObject = (encrypted, Model) => {
  const decrypted = Object.assign({}, encrypted);
  const { schema } = Model;
  Object.keys(encrypted).forEach((key) => {
    const value = encrypted[key];
    const definition = schema.attributes[key];
    if (definition && !definition.decrypted) {
      decrypted[key] = stringToValue(blockstack.decryptContent(value), definition);
    }
  });
  return decrypted;
};

export const encryptObject = (model) => {
  const object = model.attrs;
  const encrypted = Object.assign({}, object, { id: model.id });
  Object.keys(model.schema.attributes).forEach((key) => {
    const { decrypted } = model.schema.attributes[key];
    const value = object[key];
    encrypted[key] = decrypted ? value : blockstack.encryptContent(valueToString(value));
  });
  return encrypted;
};

export const signMessage = (message) => {
  const { appPrivateKey } = blockstack.loadUserData();
  return signECDSA(appPrivateKey, message);
};

export const authOptions = () => {
  const { appPrivateKey, username } = blockstack.loadUserData();
  const { signature } = signECDSA(appPrivateKey, 'RADIKS_LOGIN');
  return {
    username,
    password: signature,
  };
};

export const signUp = async (userData) => {
  const { appPrivateKey, username } = userData;
  const signed = signECDSA(appPrivateKey, 'RADIKS_LOGIN');
  await sendLoginSignedMessage(signed, username);
};
