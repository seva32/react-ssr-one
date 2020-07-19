import axios from 'axios';
import {
  GET_USER_DATA,
  GET_USER_DATA_ERROR,
  GET_CURRENT_USER,
} from './userDataTypes';
import authHeader from './auth-header';

export const getCurrentUser = () => ({
  type: GET_CURRENT_USER,
  payload: JSON.parse(localStorage.getItem('user')) || {},
});

export const getUserData = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/users', {
      headers: authHeader(),
    });
    dispatch({ type: GET_USER_DATA, payload: response.data });
    dispatch({
      type: GET_USER_DATA_ERROR,
      payload: '',
    });
  } catch (e) {
    dispatch({
      type: GET_USER_DATA_ERROR,
      payload: 'No user data available!',
    });
  }
};
