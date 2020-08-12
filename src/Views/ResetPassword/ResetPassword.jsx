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
import { Modal } from '../../Components';

// eslint-disable-next-line no-unused-vars
function ResetPasswordUI({ success, error, resetPassword, history }) {
  const [showModal, setShowModal] = React.useState(false);
  const [navigate, setNavigate] = React.useState(false);

  const toggleModalState = (_e) => {
    setShowModal(false);
    setNavigate(true);
  };

  React.useEffect(() => {
    if (navigate) {
      history.push('/');
    }
  }, [navigate, history]);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
    }),
    onSubmit: (values, { setStatus, resetForm }) => {
      resetPassword(values, () => {
        setShowModal(true);
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
      {showModal && (
        <Modal
          id="modal"
          isOpen={showModal}
          onClose={toggleModalState}
          title="Reset password"
        >
          <div className="box-body">
            {`Check your registered email - ${success.email} - to reset your password`}
          </div>
        </Modal>
      )}
      {/* {showModal && (
        <ModalDimmer
          isOpen={showModal}
          onClose={toggleModalState}
          mainTitle="Reset password"
          mainContent={`Check your registered email - ${success.email} - to reset your password`}
        />
      )} */}
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
