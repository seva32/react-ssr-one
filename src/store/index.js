import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import reduxPromise from 'redux-promise';
import logger from 'redux-logger';
import { persistStore } from 'redux-persist';
import merge from 'deepmerge';

import persistedReducer from './reducers';

// const logger = (store) => (next) => (action) => {
//   console.log('[Middleware] Dispatching: ', action);
//   const result = next(action); // eslint-disable-line
//   console.log('[Middleware] Next state: ', store.getState());
//   return result;
// };

const configureStore = () => {
  const user = JSON.parse(localStorage.getItem('user')) || '';
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const enhancer =
    process.env.NODE_ENV !== 'production'
      ? composeEnhancers(applyMiddleware(reduxPromise, reduxThunk, logger))
      : composeEnhancers(applyMiddleware(reduxPromise, reduxThunk));

  const preloadedState = window.REDUX_DATA;

  let initialState = merge(preloadedState, {
    auth: {
      authenticated: user.accessToken,
      errorMessageSignUp: '',
      errorMessageSignIn: '',
    },
  });

  initialState = merge(initialState, {
    users: {
      userData: user.userData,
      error: user.error,
      currentUser: user.currentUser,
    },
  });

  return createStore(persistedReducer, initialState, enhancer);
};

const store = configureStore();
const persistor = persistStore(store);
export default { store, persistor };
