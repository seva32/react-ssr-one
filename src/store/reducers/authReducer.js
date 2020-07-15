/* eslint-disable indent */
/* eslint-disable max-len */
import {
  AUTH_USER,
  AUTH_ERROR_SIGNUP,
  AUTH_ERROR_SIGNIN,
} from '../actions/auth/authActionTypes';

const initialState = {
  authenticated: 'yes',
  errorMessageSignUp: '',
  errorMessageSignIn: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTH_USER:
      return { ...state, authenticated: action.payload };
    case AUTH_ERROR_SIGNUP:
      return { ...state, errorMessageSignUp: action.payload };
    case AUTH_ERROR_SIGNIN:
      return { ...state, errorMessageSignIn: action.payload };
    default:
      return state;
  }
};
