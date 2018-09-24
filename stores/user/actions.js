import * as blockstack from 'blockstack';
import { signUp } from 'radiks/lib/helpers';

import * as Constants from './constants';

const login = () => {
  const redirect = `${window.location.origin}`;
  const manifest = `${redirect}/manifest.json`;
  const scopes = ['store_write', 'publish_data'];
  blockstack.redirectToSignIn(redirect, manifest, scopes);
  return {
    type: Constants.LOGIN,
  };
};

const loggingIn = () => ({
  type: Constants.USER_SIGNING_IN,
});

const logout = () => {
  blockstack.signUserOut();
  return {
    type: Constants.USER_LOGOUT,
  };
};

const gotUserData = userData => ({
  type: Constants.USER_SIGNED_IN,
  user: userData,
});

const handleLogIn = () => async function innerHandleSignIn(dispatch) {
  dispatch(loggingIn());
  let userData = blockstack.loadUserData();
  if (userData) {
    dispatch(gotUserData((userData)));
  } else if (blockstack.isSignInPending()) {
    userData = await blockstack.handlePendingSignIn();
    await signUp(userData);
    dispatch(gotUserData((userData)));
  }
};

export default {
  login,
  handleLogIn,
  logout,
};
