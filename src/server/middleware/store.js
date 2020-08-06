// prettier-ignore
import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose,
} from 'redux';
import reduxThunk from 'redux-thunk';
import reduxPromise from 'redux-promise';

import auth from '../../store/reducers/authReducer';
import posts from '../../store/reducers/postsReducer';
import users from '../../store/reducers/userDataReducer';
import csrf from '../../store/reducers/csrf';

const storeMiddleware = () => async (req, res, next) => {
  const rootReducer = combineReducers({
    auth,
    posts,
    users,
    csrf,
  });

  const enhancer = compose(applyMiddleware(reduxPromise, reduxThunk));

  const store = createStore(rootReducer, { csrf: req.csrfToken() }, enhancer);

  req.store = store;
  next();
};

export default storeMiddleware;
