import * as Constants from './constants';

export const selectCard = card => ({
  type: Constants.SELECT_CARD,
  card,
});

export const savedCard = card => ({
  type: Constants.SAVED_CARD,
  card,
});

export const deselectCard = () => ({
  type: Constants.DESELECTED_CARD,
});

export default {
  selectCard,
  savedCard,
  deselectCard,
};
