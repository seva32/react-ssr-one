import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import posts from './postsReducer';
import auth from './authReducer';
import users from './userDataReducer';
import payment from './paymentReducer';
import csrf from './csrf';

const rootPersistConfig = {
  key: 'root',
  storage,
  blacklist: ['auth', 'csrf'],
};

const rootReducer = combineReducers({
  auth,
  posts,
  users,
  csrf,
  payment,
});

export default persistReducer(rootPersistConfig, rootReducer);
