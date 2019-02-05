import * as Constants from './constants';

const initialState = {
  selectedCard: null,
  savedCard: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Constants.SELECT_CARD: {
      return {
        ...state,
        selectedCard: action.card,
        savedCard: null,
      };
    }
    case Constants.SAVED_CARD: {
      return {
        ...state,
        selectedCard: null,
        savedCard: action.card,
      };
    }
    case Constants.DESELECTED_CARD: {
      return {
        ...state,
        selectedCard: null,
      };
    }
    default:
      return state;
  }
};
