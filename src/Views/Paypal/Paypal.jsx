/* eslint-disable react/prop-types */
/* eslint-disable indent */
/* eslint-disable operator-linebreak */
import React, { useState } from 'react';
import { Form, Input, Button, Message } from 'semantic-ui-react'; // eslint-disable-line
import { useFormik } from 'formik';
import * as Yup from 'yup';

import * as Styles from './Paypal.style';
import Paypal from '../../Components/Paypal';

function PaypalButton() {
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
      resetForm({});
      setStatus({ success: true });
      setSuccessState(true);
    },
  });

  const onButtonReady = (m) => {
    console.log(m);
  };

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
          <Form.Field
            formNoValidate
            id="buttonForm"
            type="submit"
            control={Button}
            content="Confirm"
            label="Label with htmlFor"
          />
        </Form>
        <Paypal onButtonReady={onButtonReady} />
      </Styles.StyledContainer>
    </>
  );
}

export default PaypalButton;
