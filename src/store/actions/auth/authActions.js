/* eslint-disable consistent-return */
import axios from 'axios';
import {
  AUTH_USER,
  AUTH_ERROR_SIGNUP,
  AUTH_ERROR_SIGNIN,
  AUTH_EXPIRY_TOKEN,
  REFRESH_TOKEN_ERROR,
  REFRESH_TOKEN_RESTART_TIMEOUT, // para el nuevo token uso nuevamente AUTH_USER
  ACCESS_TOKEN_DELETE_ERROR,
} from './authActionTypes';
import {
  GET_USER_DATA,
  GET_USER_DATA_ERROR,
  GET_CURRENT_USER,
} from '../users/userDataTypes';
// formProps = { email, password }
// eslint-disable-next-line consistent-return

const instance = axios.create({
  withCredentials: true,
});

instance.interceptors.request.use((request) => {
  console.log('Starting Request', request);
  return request;
});

instance.interceptors.response.use((response) => {
  console.log('Response:', response);
  return response;
});

const apiUrl = process.env.SERVER_URL || '';

export const signup = (formProps, callback) => async (dispatch) => {
  try {
    const response = await instance.post(`${apiUrl}/api/signup`, formProps);
    const dateNow = Date.now();
    dispatch({ type: AUTH_USER, payload: response.data.accessToken });
    dispatch({
      type: AUTH_EXPIRY_TOKEN,
      payload: {
        expiryToken: response.data.expiryToken,
        startTime: dateNow,
      },
    });
    localStorage.setItem(
      'user',
      JSON.stringify({ ...response.data, startTime: dateNow }),
    );
    return callback();
  } catch (e) {
    dispatch({ type: AUTH_ERROR_SIGNUP, payload: 'Email in use' });
  }
};

export const signout = (callback) => async (dispatch) => {
  if (typeof window !== 'undefined') {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const response = await instance.post(`${apiUrl}/api/signout`, {
        email: user.email,
      });
      console.log(`${user.email} signout success: ${response.data.ok}`);
    } catch (e) {
      console.log(`${user.email} signout failure. ${e}`);
      dispatch({
        type: ACCESS_TOKEN_DELETE_ERROR,
        payload: { e, user }, // logging
      });
    } finally {
      localStorage.removeItem('user');
    }
  }
  if (typeof window !== 'undefined' && window.gapi) {
    const auth2 = window.gapi.auth2.getAuthInstance();
    if (auth2 != null) {
      auth2.signOut().then(
        auth2.disconnect().then(() => {
          console.log('Signed out from google...'); // eslint-disable-line
        }),
      );
    }
  }
  dispatch({ type: AUTH_USER, payload: '' });
  dispatch({ type: AUTH_ERROR_SIGNUP, payload: '' });
  dispatch({ type: AUTH_ERROR_SIGNIN, payload: '' });
  dispatch({ type: AUTH_EXPIRY_TOKEN, payload: {} });
  dispatch({ type: GET_USER_DATA, payload: {} });
  dispatch({ type: GET_USER_DATA_ERROR, payload: '' });
  dispatch({ type: GET_CURRENT_USER, payload: {} });
  return callback(); // callback for token expire timeout countdownHOC
};

// eslint-disable-next-line consistent-return
export const signin = (formProps, callback) => async (dispatch) => {
  try {
    const response = await instance.post(`${apiUrl}/api/signin`, formProps);
    console.log('((((((((((( response )))))))))))', response);
    const dateNow = Date.now();
    dispatch({ type: AUTH_USER, payload: response.data.accessToken });
    dispatch({
      type: AUTH_EXPIRY_TOKEN,
      payload: {
        expiryToken: response.data.expiryToken,
        startTime: dateNow,
      },
    });
    localStorage.setItem(
      'user',
      JSON.stringify({ ...response.data, startTime: dateNow }),
    );
    return callback();
  } catch (e) {
    dispatch({ type: AUTH_ERROR_SIGNIN, payload: 'Invalid login credentials' });
  }
};

// export const signin = (formProps, callback) => async (dispatch) => {
//   fetch(`${apiUrl}/api/signin`, {
//     method: 'POST', // or 'PUT'
//     body: JSON.stringify(formProps), // data can be `string` or {object}!
//     headers: {
//       'Content-Type': 'application/json',
//       Accept: 'application/json',
//     },
//     credentials: 'same-origin',
//     maxRedirects: 100,
//   })
//     .then((res) => res.json())
//     .catch((_error) =>
//       // eslint-disable-next-line implicit-arrow-linebreak
//       dispatch({
//         type: AUTH_ERROR_SIGNIN,
//         payload: 'Invalid login credentials',
//       }),
//     ) // eslint-disable-line
//     .then((response) => {
//       const dateNow = Date.now();
//       dispatch({ type: AUTH_USER, payload: response.accessToken });
//       dispatch({
//         type: AUTH_EXPIRY_TOKEN,
//         payload: {
//           expiryToken: response.expiryToken,
//           startTime: dateNow,
//         },
//       });
//       localStorage.setItem(
//         'user',
//         JSON.stringify({ ...response, startTime: dateNow }),
//       );
//       return callback();
//     });
// };

export const refreshToken = (callback) => async (dispatch) => {
  try {
    const response = await instance.post(`${apiUrl}/refresh-token`);
    const dateNow = Date.now();
    dispatch({ type: AUTH_USER, payload: response.data.accessToken });
    dispatch({
      type: AUTH_EXPIRY_TOKEN,
      payload: {
        expiryToken: response.data.expiryToken,
        startTime: dateNow,
      },
    });

    const user = JSON.parse(localStorage.user);
    localStorage.setItem(
      'user',
      JSON.stringify({
        ...user, // keep other info without change
        accessToken: response.data.accessToken,
        startTime: dateNow,
        expiryToken: response.data.expiryToken,
      }),
    );
    return callback(true);
  } catch (e) {
    dispatch({
      type: REFRESH_TOKEN_ERROR,
      payload: e, // logging
    });
    return callback(false);
  }
};

export const resfreshTokenRestartTimeout = () => ({
  type: REFRESH_TOKEN_RESTART_TIMEOUT,
});
