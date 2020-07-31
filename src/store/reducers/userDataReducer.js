/* eslint-disable indent */
import {
  GET_USER_DATA,
  GET_USER_DATA_ERROR,
  GET_CURRENT_USER,
} from '../actions/users/userDataTypes';

const initialState = {
  userData: {},
  error: '',
  currentUser: {},
};

function userDataReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER_DATA:
      return { ...state, userData: action.payload };
    case GET_USER_DATA_ERROR:
      console.log('get user data error: ', action.payload);
      return { ...state, error: action.payload };
    case GET_CURRENT_USER:
      return { ...state, currentUser: action.payload };
    default:
      return state;
  }
}

export default userDataReducer;
