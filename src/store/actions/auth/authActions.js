import axios from 'axios';
import {
  AUTH_USER,
  AUTH_ERROR_SIGNUP,
  AUTH_ERROR_SIGNIN,
} from './authActionTypes';
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
    localStorage.setItem('user', JSON.stringify(response.data));
    return callback();
  } catch (e) {
    dispatch({ type: AUTH_ERROR_SIGNUP, payload: 'Email in use' });
  }
};

export const signout = () => (dispatch) => {
  localStorage.removeItem('user');
  if (window.gapi) {
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
    localStorage.setItem('user', JSON.stringify(response.data));
    return callback();
  } catch (e) {
    dispatch({ type: AUTH_ERROR_SIGNIN, payload: 'Invalid login credentials' });
  }
};
