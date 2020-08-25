import axios from 'axios';
import { PAYMENT_FAILURE, PAYMENT_SUCCESS } from './payActionTypes';

// eslint-disable-next-line import/prefer-default-export
export const paymentAction = (formValues) => async (
  dispatch,
  getState,
  // eslint-disable-next-line consistent-return
) => {
  try {
    const response = await axios.post('/paypal/pay', formValues, {
      headers: { 'CSRF-Token': getState().csrf },
    });
    console.log(response.data);
    dispatch({ type: PAYMENT_SUCCESS, payload: response.data });
    dispatch({
      type: PAYMENT_FAILURE,
      payload: '',
    });
  } catch (e) {
    dispatch({
      type: PAYMENT_FAILURE,
      payload: 'Payment failed!',
    });
  }
};
