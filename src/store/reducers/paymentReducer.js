/* eslint-disable indent */
import {
  PAYMENT_FAILURE,
  PAYMENT_SUCCESS,
} from '../actions/payment/payActionTypes';

const initialState = {
  paymentData: {},
  error: '',
};

function paymentReducer(state = initialState, action) {
  switch (action.type) {
    case PAYMENT_SUCCESS:
      return { ...state, paymentData: action.payload };
    case PAYMENT_FAILURE:
      console.log('payment error: ', action.payload);
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export default paymentReducer;
