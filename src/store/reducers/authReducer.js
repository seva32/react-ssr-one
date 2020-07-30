/* eslint-disable indent */
/* eslint-disable max-len */
import {
  AUTH_USER,
  AUTH_ERROR_SIGNUP,
  AUTH_ERROR_SIGNIN,
  AUTH_EXPIRY_TOKEN,
  REFRESH_TOKEN_ERROR,
  REFRESH_TOKEN_RESTART_TIMEOUT,
  ACCESS_TOKEN_DELETE_ERROR,
} from '../actions/auth/authActionTypes';

const initialState = {
  authenticated: '',
  errorMessageSignUp: '',
  errorMessageSignIn: '',
  expiry: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTH_USER:
      return { ...state, authenticated: action.payload };
    case AUTH_ERROR_SIGNUP:
      return { ...state, errorMessageSignUp: action.payload };
    case AUTH_ERROR_SIGNIN:
      return { ...state, errorMessageSignIn: action.payload };
    case AUTH_EXPIRY_TOKEN:
      return { ...state, expiry: action.payload };
    case REFRESH_TOKEN_ERROR:
      console.log('refresh token expired|error');
      return state;
    case ACCESS_TOKEN_DELETE_ERROR:
      console.log('access token not found for delete action');
      return state;
    case REFRESH_TOKEN_RESTART_TIMEOUT:
      return state;
    default:
      return state;
  }
};
