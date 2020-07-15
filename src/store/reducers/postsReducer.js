/* eslint-disable indent */
import {
  POSTS_FETCH,
  POSTS_FETCH_ERROR,
} from '../actions/posts/postsActionTypes';

const initialState = {
  list: [],
  error: '',
};

function postsReducer(state = initialState, action) {
  switch (action.type) {
    case POSTS_FETCH:
      return { ...state, list: action.payload };
    case POSTS_FETCH_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export default postsReducer;
