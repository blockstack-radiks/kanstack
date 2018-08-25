import * as Constants from './constants';

const initialState = {
  currentUser: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Constants.LOGIN: {
      return {
        ...state,
      };
    }
    case Constants.USER_SIGNED_IN: {
      return {
        ...state,
        currentUser: action.user,
      };
    }
    default:
      return state;
  }
};
