/* eslint-disable indent */
/* eslint-disable operator-linebreak */
import React, { useState } from 'react';
import { Form, Input, Button, Message } from 'semantic-ui-react'; // eslint-disable-line
import { useFormik } from 'formik';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

import * as Styles from './Paypal.style';
import * as actions from '../../store/actions';
// import PaypalButton from '../../Components/paypal';
import BrainTree from '../../Components/Braintree';

function Paypal({ payment, error, paymentAction }) {
  const [successState, setSuccessState] = useState(false);
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().max(4, 'Must be 40 characters or less').matches(),
      // .required("Required"),
      lastName: Yup.string().max(4, 'Must be 40 characters or less').matches(),
      // .required("Required"),
    }),
    onSubmit: (values, { setStatus, resetForm }) => {
      paymentAction(values);
      resetForm({});
      setStatus({ success: true });
      setSuccessState(true);
    },
  });
  return (
    <>
      <h1>Checkout</h1>
      <Styles.StyledContainer>
        <Form onSubmit={formik.handleSubmit} success={successState}>
          <Form.Field
            id="firstName"
            control={Input}
            name="firstName"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstName}
            label="First name"
            placeholder="First name"
            error={
              formik.touched.firstName && formik.errors.firstName
                ? {
                    content: formik.errors.firstName,
                    pointing: 'below',
                  }
                : null
            }
          />
          <Form.Field
            id="lastName"
            control={Input}
            name="lastName"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
            label="Last name"
            placeholder="Last name"
            error={
              formik.touched.lastName && formik.errors.lastName
                ? {
                    content: formik.errors.lastName,
                    pointing: 'below',
                  }
                : null
            }
          />
          {/* {successState && (
            <Message
              success={successState}
              header="Form Completed"
              content="You're all signed up for the newsletter"
            />
          )} */}
          {error && error.length && (
            <Message success={false} header="Error" content={error} />
          )}
          {Object.keys(payment).length > 0 && (
            <Message
              success
              header="Payment Completed"
              content={payment.message}
            />
          )}
          <Form.Field
            formNoValidate
            id="buttonForm"
            type="submit"
            control={Button}
            content="Confirm"
            label="Label with htmlFor"
          />
        </Form>
        {/* <PaypalButton /> */}
        <BrainTree onButtonReady={() => console.log('esta listo el boton')} />
      </Styles.StyledContainer>
    </>
  );
}

const mapStateToProps = ({ payment }) => ({
  payment: payment.paymentData,
  error: payment.error,
});

Paypal.propTypes = {
  payment: PropTypes.object, // eslint-disable-line
  error: PropTypes.string, // eslint-disable-line
  paymentAction: PropTypes.func, // eslint-disable-line
};

export default connect(mapStateToProps, actions)(Paypal);
