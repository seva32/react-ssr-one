import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reduxPromise from 'redux-promise';
import reducer from '../store/reducers';

export default () => {
  const store = createStore(reducer, applyMiddleware(reduxPromise, thunk));
  return store;
};
