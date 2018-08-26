import * as blockstack from 'blockstack';
import * as Constants from './constants';

const login = () => {
  const redirect = `${window.location.origin}`;
  const manifest = `${redirect}/manifest.json`;
  console.log(redirect, manifest);
  blockstack.redirectToSignIn(redirect, manifest);
  return {
    type: Constants.LOGIN,
  };
};

const gotUserData = userData => ({
  type: Constants.USER_SIGNED_IN,
  user: userData,
});

const handleLogIn = () => async function innerHandleSignIn(dispatch) {
  if (blockstack.isUserSignedIn()) {
    const userData = blockstack.loadUserData();
    dispatch(gotUserData((userData)));
  } else if (blockstack.isSignInPending()) {
    blockstack.handlePendingSignIn()
      .then((userData) => {
        dispatch(gotUserData((userData)));
      });
  }
};

export default {
  login,
  handleLogIn,
};
