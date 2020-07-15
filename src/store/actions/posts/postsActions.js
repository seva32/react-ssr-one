import { POSTS_FETCH, POSTS_FETCH_ERROR } from './postsActionTypes';
import loadData from '../../../utils/fetch/loadData';

// eslint-disable-next-line import/prefer-default-export
export const fetchPosts = () => async (dispatch) => {
  try {
    const data = await loadData('posts');
    dispatch({ type: POSTS_FETCH, payload: data });
  } catch (e) {
    dispatch({ type: POSTS_FETCH_ERROR, payload: 'Error fetching posts' });
  }
};
