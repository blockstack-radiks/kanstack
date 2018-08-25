import * as Constants from './constants';

const initialState = {
  models: {},
};

const getNewState = (state, name) => {
  const newState = state;
  newState.models[name] = state.models[name] || {};
  return newState;
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Constants.SAVING_MODEL: {
      const { name } = action.model.schema;
      const newState = getNewState(state, name);
      newState.models[name].currentlySaving = action.model;
      return {
        ...newState,
      };
    }
    case Constants.SAVED_MODEL: {
      const { name } = action.model.schema;
      const newState = getNewState(state, name);
      newState.models[name].currentlySaving = false;
      return {
        ...newState,
      };
    }
    case Constants.FETCHED_MODELS: {
      const { name, models } = action;
      const newState = getNewState(state, name);
      newState.models[name].models = models;
      newState.models[name].isFetchingModels = false;
      return {
        ...newState,
      };
    }
    case Constants.FETCHING_MODELS: {
      const { name } = action.model.schema;
      const newState = getNewState(state, name);
      newState.models[name].isFetchingModels = true;
      return {
        ...newState,
      };
    }
    default:
      return state;
  }
};
