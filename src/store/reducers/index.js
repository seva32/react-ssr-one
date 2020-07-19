import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import posts from './postsReducer';
import auth from './authReducer';
import users from './userDataReducer';

const rootPersistConfig = {
  key: 'root',
  storage,
  blacklist: ['auth'],
};

const rootReducer = combineReducers({
  auth,
  posts,
  users,
});

export default persistReducer(rootPersistConfig, rootReducer);
