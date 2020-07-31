/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
} from 'semantic-ui-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import imagePath from '../../assets/img/logo192.png';
import { GoogleLogin } from '../../Components/GoogleButton';
import * as actions from '../../store/actions';

const SigninFormUI = ({ error, signin, history }) => {
  // eslint-disable-next-line no-unused-vars
  const [showButton, toggleShow] = useState(true);

  // prettier-disable
  const renderGoogleAuth = () =>
    ((showButton || error) && ( // eslint-disable-line
      <GoogleLogin
        onSuccess={(res) => {
          // si alguno de los dos da undefined se cae la auth
          if (res.Ot.yu === undefined && res.Pt.zu === undefined) {
            alert(res);
          }
          const emailAll = res.Ot.yu !== undefined ? res.Ot.yu : res.Pt.zu; // chrome opera
          if (emailAll && res.googleId) {
            toggleShow(false);
            signin(
              {
                email: emailAll,
                password: res.googleId,
              },
              () => {
                history.push('/');
              },
            );
          }
        }}
        onFailure={(_res) => (
          <Message negative>
            <Message.Header>
              There was a problem trying to signin with Google
            </Message.Header>
            <p>Try again or use another method</p>
          </Message>
        )}
        // use REACT_APP_GOOGLE_ID=
        // eslint-disable-next-line max-len
        clientId="337014600692-84c6cvbn4370f08b6cdp8jkc2ndjln84.apps.googleusercontent.com"
      >
        Signin
      </GoogleLogin>
    )) ||
    null;

  const formik = useFormik({
    initialValues: {
      password: '',
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address'),
      // .required("Required"),
      password: Yup.string()
        .required('No password provided.')
        .min(2, 'Password is too short - should be 8 chars minimum.')
        .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
    }),
    onSubmit: (values, { setStatus, resetForm }) => {
      signin(values, () => {
        history.push('/');
      });
      resetForm({});
      setStatus({
        success: true,
      });
    },
  });
  return (
    <>
      <Grid
        textAlign="center"
        style={{
          height: '100vh',
        }}
        verticalAlign="middle"
      >
        <Grid.Column
          style={{
            maxWidth: 450,
          }}
        >
          <Header as="h2" color="teal" textAlign="center">
            <Image src={imagePath} alt="No logo image" />
            Log-in to your account
          </Header>
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
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                id="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                error={
                  formik.touched.password && formik.errors.password
                    ? {
                        content: formik.errors.password,
                        pointing: 'below',
                      }
                    : null
                }
              />

              <Button color="red" fluid size="large" type="submit">
                Login
              </Button>
            </Segment>
          </Form>

          <Message>Singin with Google {renderGoogleAuth()}</Message>

          {error && (
            <Message negative>
              <Message.Header>{`You couldnt signin: ${error}`}</Message.Header>
              <p>Try again</p>
            </Message>
          )}

          <Message>
            New to us? <Link to="/signup">Sign Up</Link>
          </Message>
        </Grid.Column>
      </Grid>
    </>
  );
};

SigninFormUI.propTypes = {
  error: PropTypes.string,
  signin: PropTypes.func,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

SigninFormUI.defaultProps = {
  error: '',
  signin: () => {},
};

export default connect(
  ({ auth }) => ({
    error: auth.errorMessageSignIn,
  }),
  actions,
)(SigninFormUI);
