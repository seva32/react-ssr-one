/* eslint-disable indent */
/* eslint-disable max-len */
import {
  AUTH_USER,
  AUTH_ERROR_SIGNUP,
  AUTH_ERROR_SIGNIN,
  AUTH_EXPIRY_TOKEN,
  REFRESH_TOKEN_ERROR,
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
      return state;
    default:
      return state;
  }
};
