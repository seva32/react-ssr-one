/* eslint-disable object-curly-newline */
/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Segment, Button, Message } from 'semantic-ui-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { Container } from './ResetPasswordUI.style';
import * as actions from '../../store/actions';

// eslint-disable-next-line no-unused-vars
function ResetPasswordUI({ success, error, resetPassword, history }) {
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
    }),
    onSubmit: (values, { setStatus, resetForm }) => {
      resetPassword(values, () => {
        history.push('/');
      });
      resetForm({});
      setStatus({
        success: true,
      });
    },
  });
  return (
    <Container>
      <Form onSubmit={formik.handleSubmit} size="large">
        <Segment>
          <Form.Input
            fluid
            icon="user"
            iconPosition="left"
            placeholder="E-mail address"
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            error={
              formik.touched.email && formik.errors.email
                ? {
                    content: formik.errors.email,
                    pointing: 'below',
                  }
                : null
            }
          />

          <Button color="red" fluid size="large" type="submit">
            Reset Password
          </Button>

          {error && (
            <Message negative>
              <Message.Header>{`Password reset failed: ${error}`}</Message.Header>
              <p>Try again</p>
            </Message>
          )}
        </Segment>
      </Form>
    </Container>
  );
}

ResetPasswordUI.propTypes = {
  error: PropTypes.string,
  success: PropTypes.object, // eslint-disable-line
  resetPassword: PropTypes.func,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

ResetPasswordUI.defaultProps = {
  error: '',
  success: {},
  resetPassword: () => {},
};

export default connect(
  ({ auth }) => ({
    error: auth.resetPasswordError,
    success: auth.resetPassword,
  }),
  actions,
)(ResetPasswordUI);
