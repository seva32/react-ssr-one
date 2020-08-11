/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Segment, Button, Message } from 'semantic-ui-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import omit from 'lodash.omit';
import { Container } from './ChangePassword.style';
import * as actions from '../../store/actions';

// eslint-disable-next-line no-unused-vars
function ChangePasswordUI({ success, error, changePassword, history, match }) {
  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      repeatpassword: '',
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required('No password provided.')
        .min(2, 'Password is too short - should be 8 chars minimum.')
        .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
      repeatpassword: Yup.string().when('newPassword', {
        is: (val) => val && val.length > 0,
        then: Yup.string().oneOf(
          [Yup.ref('newPassword')],
          'Both password need to be the same',
        ),
      }),
    }),
    onSubmit: (values, { setStatus, resetForm }) => {
      const { token, email } = match.params;
      values = { ...values, token, email }; // eslint-disable-line
      changePassword(omit(values, ['repeatpassword']), () => {
        history.push('/');
      });
      resetForm({});
      setStatus({ success: true });
    },
  });
  return (
    <Container>
      <Form onSubmit={formik.handleSubmit} size="large">
        <Segment>
          <Form.Input
            fluid
            icon="lock"
            iconPosition="left"
            placeholder="Old Password"
            type="password"
            id="oldPassword"
            name="oldPassword"
            label="Old password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.oldPassword}
          />
          <Form.Input
            fluid
            icon="lock"
            iconPosition="left"
            placeholder="New Password"
            type="password"
            id="newPassword"
            name="newPassword"
            label="New password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
            error={
              formik.touched.newPassword && formik.errors.newPassword
                ? {
                    content: formik.errors.newPassword,
                    pointing: 'below',
                  }
                : null
            }
          />
          <Form.Input
            fluid
            icon="repeat"
            iconPosition="left"
            placeholder="Repeat Password"
            type="password"
            id="repeatpassword"
            name="repeatpassword"
            label="Repeat new password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.repeatpassword}
            error={
              formik.touched.repeatpassword && formik.errors.repeatpassword
                ? {
                    content: formik.errors.repeatpassword,
                    pointing: 'below',
                  }
                : null
            }
          />

          <Button color="red" fluid size="large" type="submit">
            Change Password
          </Button>

          {error && (
            <Message negative>
              <Message.Header>{`Password change failed: ${error}`}</Message.Header>
              <p>Try again</p>
            </Message>
          )}
        </Segment>
      </Form>
    </Container>
  );
}

ChangePasswordUI.propTypes = {
  error: PropTypes.string,
  success: PropTypes.object, // eslint-disable-line
  changePassword: PropTypes.func,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      token: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    }),
  }),
};

ChangePasswordUI.defaultProps = {
  error: '',
  success: {},
  changePassword: () => {},
  match: {},
};

export default connect(
  ({ auth }) => ({
    error: auth.changePasswordError,
    success: auth.changePassword,
  }),
  actions,
)(ChangePasswordUI);
