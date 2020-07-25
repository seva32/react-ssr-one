import axios from 'axios';
import {
  AUTH_USER,
  AUTH_ERROR_SIGNUP,
  AUTH_ERROR_SIGNIN,
  AUTH_EXPIRY_TOKEN,
} from './authActionTypes';
import {
  GET_USER_DATA,
  GET_USER_DATA_ERROR,
  GET_CURRENT_USER,
} from '../users/userDataTypes';
// formProps = { email, password }
// eslint-disable-next-line consistent-return
export const signup = (formProps, callback) => async (dispatch) => {
  try {
    const response = await axios.post('/api/signup', formProps, {
      withCredentials: true,
      headers: {
        crossorigin: true,
      },
    });
    dispatch({ type: AUTH_USER, payload: response.data.accessToken });
    dispatch({ type: AUTH_EXPIRY_TOKEN, payload: response.data.expiryToken });
    localStorage.setItem('user', JSON.stringify(response.data));
    return callback();
  } catch (e) {
    dispatch({ type: AUTH_ERROR_SIGNUP, payload: 'Email in use' });
  }
};

export const signout = (callback) => async (dispatch) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
  if (typeof window !== 'undefined' && window.gapi) {
    const auth2 = window.gapi.auth2.getAuthInstance();
    if (auth2 != null) {
      auth2.signOut().then(
        auth2.disconnect().then(() => {
          console.log('Exited from google...'); // eslint-disable-line
        }),
      );
    }
  }
  dispatch({ type: AUTH_USER, payload: '' });
  dispatch({ type: AUTH_ERROR_SIGNUP, payload: '' });
  dispatch({ type: AUTH_ERROR_SIGNIN, payload: '' });
  dispatch({ type: AUTH_EXPIRY_TOKEN, payload: null });
  dispatch({ type: GET_USER_DATA, payload: {} });
  dispatch({ type: GET_USER_DATA_ERROR, payload: '' });
  dispatch({ type: GET_CURRENT_USER, payload: {} });
  return callback();
};

// eslint-disable-next-line consistent-return
export const signin = (formProps, callback) => async (dispatch) => {
  try {
    const response = await axios.post('/api/signin', formProps, {
      withCredentials: true,
      headers: {
        crossorigin: true,
      },
    });
    dispatch({ type: AUTH_USER, payload: response.data.accessToken });
    dispatch({ type: AUTH_EXPIRY_TOKEN, payload: response.data.expiryToken });
    localStorage.setItem('user', JSON.stringify(response.data));
    return callback();
  } catch (e) {
    dispatch({ type: AUTH_ERROR_SIGNIN, payload: 'Invalid login credentials' });
  }
};
