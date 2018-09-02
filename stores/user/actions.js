import * as blockstack from 'blockstack';
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
  if (blockstack.isSignInPending()) {
    blockstack.handlePendingSignIn()
      .then((userData) => {
        dispatch(gotUserData((userData)));
      });
  }
};

export default {
  login,
  handleLogIn,
  logout,
};
