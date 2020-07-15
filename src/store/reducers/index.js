import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import posts from './postsReducer';
import auth from './authReducer';

const rootPersistConfig = {
  key: 'root',
  storage,
  blacklist: ['auth'],
};

const rootReducer = combineReducers({
  auth,
  posts,
});

export default persistReducer(rootPersistConfig, rootReducer);
