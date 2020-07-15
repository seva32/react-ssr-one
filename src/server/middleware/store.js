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

const storeMiddleware = () => async (req, res, next) => {
  const rootReducer = combineReducers({
    auth,
    posts,
  });

  const enhancer = compose(applyMiddleware(reduxPromise, reduxThunk));

  const store = createStore(rootReducer, {}, enhancer);

  req.store = store;
  next();
};

export default storeMiddleware;
