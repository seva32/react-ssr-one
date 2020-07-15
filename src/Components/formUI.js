/* eslint-disable indent */
/* eslint-disable operator-linebreak */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  TextArea,
  Button,
  Select,
  Message,
} from 'semantic-ui-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const genderOptions = [
  { key: 'm', text: 'Male', value: 'male' },
  { key: 'f', text: 'Female', value: 'female' },
  { key: 'o', text: 'Other', value: 'other' },
];

const FormUI = ({ select }) => {
  const [successState, setSuccessState] = useState(false);
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      message: '',
      email: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().max(4, 'Must be 40 characters or less').matches(),
      // .required("Required"),
      lastName: Yup.string().max(4, 'Must be 40 characters or less').matches(),
      // .required("Required"),
      message: Yup.string()
        .min(1, 'Must be a >= 1 characters message')
        .required('Required'),
      email: Yup.string().email('Invalid email address'),
      // .required("Required"),
    }),
    onSubmit: (values, { setStatus, resetForm }) => {
      // eslint-disable-next-line no-console
      console.log(...Object.values(values));
      resetForm({});
      setStatus({ success: true });
      setSuccessState(true);
    },
  });
  return (
    <Form onSubmit={formik.handleSubmit} success={successState}>
      <Form.Group widths="equal">
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
        {select && (
          <Form.Field
            control={Select}
            options={genderOptions}
            label={{
              children: 'Gender',
              htmlFor: 'form-select-control-gender',
            }}
            placeholder="Gender"
            search
            searchInput={{ id: 'form-select-control-gender' }}
          />
        )}
      </Form.Group>
      <Form.Field
        id="message"
        name="message"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.message}
        control={TextArea}
        label="Message"
        placeholder="Message"
        error={
          formik.touched.message && formik.errors.message
            ? {
                content: formik.errors.message,
                pointing: 'below',
              }
            : null
        }
      />
      <Form.Field
        id="email"
        control={Input}
        name="email"
        type="email"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
        label="Email"
        placeholder="joe@schmoe.com"
        error={
          formik.touched.email && formik.errors.email
            ? {
                content: formik.errors.email,
                pointing: 'below',
              }
            : null
        }
      />
      {successState && (
        <Message
          success={successState}
          header="Form Completed"
          content="You're all signed up for the newsletter"
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
  );
};

FormUI.propTypes = {
  select: PropTypes.string,
};

FormUI.defaultProps = {
  select: null,
};

export default FormUI;
