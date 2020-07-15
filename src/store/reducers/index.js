import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { CookieStorage } from 'redux-persist-cookie-storage';
import Cookies from 'cookies-js';

import posts from './postsReducer';
import auth from './authReducer';

const rootPersistConfig = {
  key: 'root',
  storage,
  blacklist: ['auth'],
};

const authPersistConfig = {
  key: 'auth',
  storage: new CookieStorage(Cookies),
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, auth),
  posts,
});

export default persistReducer(rootPersistConfig, rootReducer);
