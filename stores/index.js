import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
// import createHistory from 'history/createBrowserHistory';
import persistState from 'redux-localstorage';

import rootReducer from './reducer';

const initialState = {};
const enhancers = [];
const middleware = [
  thunk,
];

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

// if (process.env.NODE_ENV === 'development') {
//   const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

//   if (typeof devToolsExtension === 'function') {
//     enhancers.push(devToolsExtension());
//   }
// }

const composedEnhancers = composeEnhancers(
  applyMiddleware(...middleware),
  persistState(['user']),
  ...enhancers,
);

const store = createStore(
  rootReducer,
  initialState,
  composedEnhancers,
);

export default store;
