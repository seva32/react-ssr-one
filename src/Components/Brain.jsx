/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';
import brainclient from 'braintree-web/client';
import brainhostedFields from 'braintree-web/hosted-fields';
import axios from 'axios';
import { connect } from 'react-redux';
import './Brain.scss';

function Braintree({ onButtonReady, csrf }) {
  // const [loading, setLoading] = React.useState(true);
  const [successMessage, setSuccessMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(false);
  const [transactionInCourse, setTransactionInCourse] = React.useState(false);
  const [labelFloat, setLabelFloat] = React.useState('');
  const [labelFilled, setLabelFilled] = React.useState('');
  const [labelInvalid, setLabelInvalid] = React.useState('');

  React.useEffect(() => {
    const inputEl = document.getElementById('inputEl');

    if (!transactionInCourse) {
      brainclient.create(
        {
          authorization: 'sandbox_s9kgnqvj_cqxswk83c3wbnj99',
        },
        clientDidCreate,
      );
    }
    function clientDidCreate(err, client) {
      if (err) console.log(err);
      brainhostedFields.create(
        // {
        //   client,
        //   styles: {
        //     input: {
        //       'font-size': '16pt',
        //       color: '#3A3A3A',
        //     },

        //     '.number': {
        //       'font-family': 'monospace',
        //     },

        //     '.valid': {
        //       color: 'green',
        //     },
        //   },
        //   fields: {
        //     number: {
        //       selector: '#card-number',
        //     },
        //     cvv: {
        //       selector: '#cvv',
        //     },
        //     expirationDate: {
        //       selector: '#expiration-date',
        //     },
        //   },
        // },
        // material style
        {
          client,
          styles: {
            input: {
              'font-size': '16px',
              'font-family': 'roboto, verdana, sans-serif',
              'font-weight': 'lighter',
              color: 'black',
            },
            ':focus': {
              color: 'black',
            },
            '.valid': {
              color: 'black',
            },
            '.invalid': {
              color: 'black',
            },
          },
          fields: {
            number: {
              selector: '#card-number',
              placeholder: '1111 1111 1111 1111',
            },
            cvv: {
              selector: '#cvv',
              placeholder: '111',
            },
            expirationDate: {
              selector: '#expiration-date',
              placeholder: 'MM/YY',
            },
            postalCode: {
              selector: '#postal-code',
              placeholder: '11111',
            },
          },
        },

        hostedFieldsDidCreate,
      );
    }

    function hostedFieldsDidCreate(err, hostedFields) {
      onButtonReady();
      // setLoading(false);
      if (err) console.log(err);

      // material design
      // function findLabel(field) {
      //   return document.querySelector(
      //     `.hosted-field--label[for="${field.container.id}"]`,
      //   );
      // }

      hostedFields.on('focus', (event) => {
        const field = event.fields[event.emittedBy];
        setLabelFloat(field.container.id);
        // const fieldElement = findLabel(field);
        // fieldElement.setAttribute('class', 'label-float');
        // fieldElement.removeAttribute('filled');
      });

      // Emulates floating label pattern
      hostedFields.on('blur', (event) => {
        const field = event.fields[event.emittedBy];
        if (field.isEmpty) {
          setLabelFloat('');
        } else if (field.isValid) {
          setLabelFilled(field.container.id); // labelFilled -> filled css class
        } else {
          setLabelInvalid(`invalid-${field.container.id}-add`); // labelInvalid -> invalid css class
        }
        // const label = findLabel(field);
        // if (field.isEmpty) {
        //   label.removeAttribute('label-float');
        // } else if (field.isValid) {
        //   label.setAttribute('class', 'filled');
        // } else {
        //   label.setAttribute('class', 'invalid');
        // }
      });

      hostedFields.on('empty', (event) => {
        const field = event.fields[event.emittedBy];
        setLabelInvalid(`invalid-${field.container.id}`);
        setLabelFilled('');
        // const fieldElement = findLabel(field);

        // fieldElement.removeAttribute('invalid');
        // fieldElement.removeAttribute('filled');
      });

      hostedFields.on('validityChange', (event) => {
        const field = event.fields[event.emittedBy];
        if (field.isPotentiallyValid) {
          setLabelInvalid(`invalid-${field.container.id}`);
        } else {
          setLabelInvalid(`invalid-${field.container.id}-add`);
        }
        // const label = findLabel(field);
        // if (field.isPotentiallyValid) {
        //   label.removeAttribute('invalid');
        // } else {
        //   label.setAttribute('class', 'invalid');
        // }
      });
      // end material design

      inputEl.addEventListener('click', submitHandler.bind(null, hostedFields));
      inputEl.removeAttribute('disabled');
    }

    function submitHandler(hostedFields, event) {
      event.preventDefault();
      setTransactionInCourse(true);
      inputEl.setAttribute('disabled', 'disabled');

      // check that all fields are valid, it was verified on every field but this is 2nd aproach
      const state = hostedFields.getState();
      const formValid = Object.keys(state.fields).every(
        (key) => state.fields[key].isValid,
      );

      if (formValid) {
        // Tokenize Hosted Fields
        hostedFields.tokenize((err, payload) => {
          if (err) {
            inputEl.removeAttribute('disabled');
            console.error(err);
          }
          if (csrf) {
            const authHeader = require('../store/actions/users/auth-header')
              .default;
            const defaultOptions = {
              baseURL: 'http://localhost:8080',
              headers: authHeader(csrf),
            };
            const axiosInstance = axios.create(defaultOptions);
            axiosInstance
              .post('/payment/braintree-checkout', {
                paymentMethodNonce: payload.nonce,
              })
              .then(({ data }) => {
                // Tear down the Hosted Fields form
                hostedFields.teardown((teardownErr) => {
                  if (teardownErr) {
                    console.error(
                      'Could not tear down the Hosted Fields form!',
                    );
                  } else {
                    console.info('Hosted Fields form has been torn down!');
                    // Remove the 'Submit payment' button
                    inputEl.disabled = true;
                  }
                });

                setTransactionInCourse(false);

                if (data.success) {
                  setSuccessMessage(true);
                  setErrorMessage(false);
                } else {
                  console.log(data.message);
                  setErrorMessage(true);
                  setSuccessMessage(false);
                }
              })
              .catch((e) => {
                setTransactionInCourse(false);

                console.log(e);
                // setErrorMessage(true);
              });
          } else {
            setErrorMessage(true);
          }
        });
      } else {
        console.log('Some invalid data from fields');
        setErrorMessage(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if (loading) {
  //   return <div>Loading....</div>;
  // }

  if (successMessage) {
    return (
      <>
        <h1>Success</h1>
        <p>
          Your Hosted Fields form is working! Check your
          <a href="https://sandbox.braintreegateway.com/login">
            sandbox Control Panel
          </a>
          for your test transactions.
        </p>
        <p>Refresh to try another transaction.</p>
      </>
    );
  }

  if (errorMessage) {
    return (
      <>
        <h1>Error</h1>
        <p>Check your console.</p>
      </>
    );
  }

  return (
    <div>
      {/* <form action="/" id="my-sample-form" className="form">
        <input type="hidden" name="payment_method_nonce" />
        <label htmlFor="card-number" className="card">
          Card Number
        </label>
        <div id="card-number" />

        <label htmlFor="cvv">CVV</label>
        <div id="cvv" />

        <label htmlFor="expiration-date">Expiration Date</label>
        <div id="expiration-date" />

        <input id="inputEl" type="submit" value="Pay" disabled />
      </form> */}

      <form id="cardForm">
        <div className="panel">
          <header className="panel__header">
            <h1>Card Payment</h1>
          </header>
          <div className="panel__content">
            <div className="textfield--float-label">
              {/* <!-- Begin hosted fields section --> */}
              <label
                className={`hosted-field--label 
                ${labelFloat === 'card-number' ? 'label-float' : ''}
                ${labelFilled === 'card-number' ? 'filled' : ''}
                ${
                  labelInvalid.includes('card-number') &&
                  labelInvalid.includes('add')
                    ? 'invalid'
                    : ''
                }`}
                htmlFor="card-number"
              >
                <span className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                  </svg>
                </span>{' '}
                Card Number
              </label>
              <div id="card-number" className="hosted-field" />
              {/* <!-- End hosted fields section --> */}
            </div>
            <div className="textfield--float-label">
              {/* <!-- Begin hosted fields section --> */}
              <label
                className={`hosted-field--label 
                ${labelFloat === 'expiration-date' ? 'label-float' : ''}
                ${labelFilled === 'expiration-date' ? 'filled' : ''}
                ${
                  labelInvalid.includes('expiration-date') &&
                  labelInvalid.includes('add')
                    ? 'invalid'
                    : ''
                }`}
                htmlFor="expiration-date"
              >
                <span className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                  </svg>
                </span>
                Expiration Date
              </label>
              <div id="expiration-date" className="hosted-field" />
              {/* <!-- End hosted fields section --> */}
            </div>
            <div className="textfield--float-label">
              {/* <!-- Begin hosted fields section --> */}
              <label
                className={`hosted-field--label 
                ${labelFloat === 'cvv' ? 'label-float' : ''}
                ${labelFilled === 'cvv' ? 'filled' : ''}
                ${
                  labelInvalid.includes('cvv') && labelInvalid.includes('add')
                    ? 'invalid'
                    : ''
                }`}
                htmlFor="cvv"
              >
                <span className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                </span>
                CVV
              </label>
              <div id="cvv" className="hosted-field" />
              {/* <!-- End hosted fields section --> */}
            </div>
            <div className="textfield--float-label">
              {/* <!-- Begin hosted fields section --> */}
              <label
                className={`hosted-field--label 
                ${labelFloat === 'postal-code' ? 'label-float' : ''}
                ${labelFilled === 'postal-code' ? 'filled' : ''}
                ${
                  labelInvalid.includes('postal-code') &&
                  labelInvalid.includes('add')
                    ? 'invalid'
                    : ''
                }`}
                htmlFor="postal-code"
              >
                <span className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </span>
                Postal Code
              </label>
              <div id="postal-code" className="hosted-field" />
              {/* <!-- End hosted fields section --> */}
            </div>
          </div>
          <footer className="panel__footer">
            <button className="pay-button" type="button" id="inputEl">
              Pay
            </button>
            {/* <input id="inputEl" type="submit" value="Pay" disabled /> */}
          </footer>
        </div>
      </form>
    </div>
  );
}

Braintree.propTypes = {
  onButtonReady: PropTypes.func.isRequired,
  csrf: PropTypes.string,
};

Braintree.defaultProps = {
  csrf: '',
};

const mapStateToProps = ({ csrf }) => ({
  csrf,
});

export default connect(mapStateToProps, null)(Braintree);
