import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
// import createHistory from 'history/createBrowserHistory';
// import persistState from 'redux-localstorage';
import storage from 'redux-persist/lib/storage/session';
import { persistStore, persistReducer } from 'redux-persist';

import rootReducer from './reducer';

const initialState = {};
const enhancers = [];
const middleware = [
  thunk,
];

const persistConfig = {
  key: 'kanstack',
  storage,
  whitelist: ['user'],
};

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const persistedReducer = persistReducer(persistConfig, rootReducer);

const composedEnhancers = composeEnhancers(
  applyMiddleware(...middleware),
  // persistState(['user'], { key: 'kanstack' }),
  ...enhancers,
);

export const store = createStore(
  persistedReducer,
  initialState,
  composedEnhancers,
);

export const persistor = persistStore(store);
