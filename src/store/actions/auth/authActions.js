/* eslint-disable consistent-return */
import axios from 'axios';
import {
  AUTH_USER, // para auth el user y para nuevo refreshToken
  AUTH_ERROR_SIGNUP,
  AUTH_ERROR_SIGNIN,
  AUTH_EXPIRY_TOKEN,
  REFRESH_TOKEN_ERROR,
  REFRESH_TOKEN_RESTART_TIMEOUT,
  ACCESS_TOKEN_DELETE_ERROR,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_ERROR,
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
  timeout: 10000,
  params: {},
  proxy: true,
});

if (process.env.NODE_ENV !== 'production') {
  instance.interceptors.request.use(
    (request) => {
      console.log('((((((((((( request )))))))))))', request);
      return request;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use((response) => {
    console.log('((((((((((( response )))))))))))', response);
    return response;
  });
}

export const signup = (formProps, callback) => async (dispatch, getState) => {
  try {
    const response = await instance.post('/auth/signup', formProps, {
      headers: { 'CSRF-Token': getState().csrf },
    });
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
    const message = e.response.data.message || 'Email in use';
    dispatch({ type: AUTH_ERROR_SIGNUP, payload: message });
  }
};

export const signout = (callback) => async (dispatch, getState) => {
  if (process.env.WEBPACK) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      try {
        // eslint-disable-next-line no-unused-vars
        const response = await instance.post(
          '/auth/signout',
          {
            email: user.email,
          },
          {
            headers: { 'CSRF-Token': getState().csrf },
          },
        );
        // console.log(`${user.email} signout success: ${response.data.ok}`);
      } catch (e) {
        // console.log(`${user.email} signout failure. ${e}`);
        dispatch({
          type: ACCESS_TOKEN_DELETE_ERROR,
          payload: { e, user }, // logging
        });
      } finally {
        localStorage.removeItem('user');
      }
    }
  }
  if (process.env.WEBPACK && window.gapi) {
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
  dispatch({ type: RESET_PASSWORD_ERROR, payload: '' });
  dispatch({ type: CHANGE_PASSWORD_ERROR, payload: '' });
  return callback(); // callback for token expire timeout countdownHOC
};

// eslint-disable-next-line consistent-return
export const signin = (formProps, callback) => async (dispatch, getState) => {
  try {
    const response = await instance.post('/auth/signin', formProps, {
      headers: { 'CSRF-Token': getState().csrf },
    });
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
    const message = e.response.data.message || 'Invalid login credentials';
    dispatch({ type: AUTH_ERROR_SIGNIN, payload: message });
  }
};

// export const signin = (formProps, callback) => async (dispatch) => {
//   fetch(`${apiUrl}/auth/signin`, {
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

export const refreshToken = (callback) => async (dispatch, getState) => {
  try {
    const response = await instance.post(
      '/auth/refresh-token',
      {},
      {
        headers: { 'CSRF-Token': getState().csrf },
      },
    );
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

// formProps == email, reset es solamente para el envio de mail/link para change
export const resetPassword = (formProps, callback) => async (
  dispatch,
  getState,
) => {
  try {
    const response = await instance.post('/auth/reset-password', formProps, {
      headers: { 'CSRF-Token': getState().csrf },
    });
    if (response) {
      dispatch({
        type: RESET_PASSWORD_SUCCESS,
        payload: formProps,
      });
    }
    return callback();
  } catch (e) {
    dispatch({
      type: RESET_PASSWORD_ERROR,
      // res.status(404).send({ message: 'User Email Not found.' });
      payload: e.response.data.message,
    });
  }
};

// formProps email, token, oldPassword, newPassword
export const changePassword = (formProps, callback) => async (
  dispatch,
  getState,
) => {
  try {
    const response = await instance.post('/auth/change-password', formProps, {
      headers: { 'CSRF-Token': getState().csrf },
    });
    dispatch({
      type: CHANGE_PASSWORD_SUCCESS,
      payload: response.data,
    });
    return callback();
  } catch (e) {
    dispatch({
      type: CHANGE_PASSWORD_ERROR,
      payload: e.response.data.message,
    });
  }
};
