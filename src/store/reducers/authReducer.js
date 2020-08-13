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
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_ERROR,
} from '../actions/auth/authActionTypes';

let log = null;
if (process.env.WEBPACK) {
  log = require('../../utils/loglevel').default;
  log.enableAll();
  log.warn('loglevel');
} else {
  log = console.log; // eslint-disable-line
}

const initialState = {
  authenticated: '',
  errorMessageSignUp: '',
  errorMessageSignIn: '',
  expiry: {},
  resetPassword: {},
  resetPasswordError: '',
  changePassword: {},
  changePasswordError: '',
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
      log.warn(`refresh token expired|error: ${action.payload}`);
      return state;
    case ACCESS_TOKEN_DELETE_ERROR:
      log.warn(`access token not found for delete action: ${action.payload.e}`);
      return state;
    case REFRESH_TOKEN_RESTART_TIMEOUT:
      console.log(log);
      log.warn('refresh token timeout...');
      return state;
    case RESET_PASSWORD_SUCCESS:
      return { ...state, resetPassword: action.payload };
    case RESET_PASSWORD_ERROR:
      return { ...state, resetPasswordError: action.payload };
    case CHANGE_PASSWORD_SUCCESS:
      return { ...state, changePassword: action.payload };
    case CHANGE_PASSWORD_ERROR:
      return { ...state, changePasswordError: action.payload };
    default:
      return state;
  }
};
