export const selectModel = (state, model) => state.radiks.models[model];

export const selectCurrentlySavingModel = (state, modelName) => {
  const model = selectModel(state, modelName);
  return model && model.currentlySaving;
};

export const selectModels = (state, modelName) => {
  const model = selectModel(state, modelName);
  return model && model.models;
};

export const selectIsFetchingModels = (state, modelName) => {
  const model = selectModel(state, modelName);
  return model && model.isFetchingModels;
};
