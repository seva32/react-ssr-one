/* eslint-disable indent */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import './BrainTree.css';

function BrainTree({ onButtonReady, csrf }) {
  const inputEl = useRef(null);
  const formEl = useRef(null);
  const [sdkReadyClient, setSdkReadyClient] = useState(false);
  const [sdkReadyField, setSdkReadyField] = useState(false);
  const [scripts, setScripts] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [fieldsVisible, setFieldsVisible] = useState(false);

  const addBraintreeSdk = (src, onReady) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.async = true;
    script.onload = () => {
      onReady(true);
    };
    script.onerror = () => {
      throw new Error('Paypal SDK could not be loaded.');
    };
    document.body.appendChild(script);
  };
  useEffect(() => {
    if (window !== undefined && window.braintree === undefined) {
      addBraintreeSdk(
        'https://js.braintreegateway.com/web/3.44.2/js/client.min.js',
        setSdkReadyClient,
      );
      addBraintreeSdk(
        'https://js.braintreegateway.com/web/3.44.2/js/hosted-fields.min.js',
        setSdkReadyField,
      );
    } else if (
      window !== undefined &&
      window.braintree !== undefined &&
      sdkReadyClient &&
      sdkReadyField
    ) {
      setScripts(true);
      onButtonReady();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let axiosInstance = null;
  if (typeof window !== 'undefined' && csrf) {
    const authHeader = require('../store/actions/users/auth-header').default;
    const defaultOptions = {
      baseURL: 'http://localhost:8080',
      headers: authHeader(csrf),
    };
    axiosInstance = axios.create(defaultOptions);
  }

  if (
    typeof window !== 'undefined' &&
    window.braintree &&
    window.braintree.client &&
    window.braintree.hostedFields &&
    axiosInstance &&
    !fieldsVisible
  ) {
    window.braintree.client.create(
      {
        authorization: 'sandbox_s9kgnqvj_cqxswk83c3wbnj99',
      },
      (clientErr, clientInstance) => {
        if (clientErr) {
          console.error('clientErr::::::::', clientErr);
          return;
        }

        window.braintree.hostedFields.create(
          {
            client: clientInstance,
            // puedo dar estilo al input solamente aqui
            // a los containers div si les puedo dar afuera
            styles: {
              input: {
                'font-size': '14px',
                color: '#3A3A3A',
                'font-family': 'monospace',
                transition: 'color 160ms linear',
                '-webkit-transition': 'color 160ms linear',
              },
              'input.invalid': {
                color: 'red',
              },
              'input.valid': {
                color: 'green',
              },
              'input:focus': {
                color: 'blue',
              },
              // Media queries
              // Note that these apply to the iframe, not the root window.
              '@media screen and (max-width: 700px)': {
                input: {
                  'font-size': '14px',
                },
              },
            },
            fields: {
              number: {
                selector: '#card-number',
                placeholder: '4111 1111 1111 1111',
              },
              cvv: {
                selector: '#cvv',
                placeholder: '123',
              },
              expirationDate: {
                selector: '#expiration-date',
                placeholder: '10/2022',
              },
            },
          },
          (hostedFieldsErr, instance) => {
            if (hostedFieldsErr) {
              console.error('hostedFieldsErr', hostedFieldsErr);
              return;
            }

            setFieldsVisible(true);

            // inputEl.current.disabled = false;

            // Initialize the form submit event
            inputEl.current.addEventListener(
              'click',
              (event) => {
                event.preventDefault();
                // When the user clicks on the 'Submit payment' button this code will send the
                // encrypted payment information in a variable called a payment method nonce
                instance.tokenize((tokenizeErr, payload) => {
                  if (tokenizeErr) {
                    console.error(tokenizeErr);
                    return; // eslint-disable-line
                  }

                  axiosInstance
                    .post('/payment/braintree-checkout', {
                      paymentMethodNonce: payload.nonce,
                    })
                    .then(({ data }) => {
                      // Tear down the Hosted Fields form
                      instance.teardown((teardownErr) => {
                        if (teardownErr) {
                          console.error(
                            'Could not tear down the Hosted Fields form!',
                          );
                        } else {
                          console.info(
                            'Hosted Fields form has been torn down!',
                          );
                          // Remove the 'Submit payment' button
                          inputEl.current.disabled = true;
                        }
                      });

                      if (data.success) {
                        setSuccessMessage(true);
                      } else {
                        setErrorMessage(true);
                      }
                    })
                    .catch((e) => console.log(e));
                });
              },
              false,
            );
          },
        );
      },
    );
  }

  if (typeof window === 'undefined') {
    return <div>Loading...</div>;
  }
  return (
    <div className="background">
      <form
        className={`ui ${!fieldsVisible ? 'loading' : ''} form`}
        id="hosted-fields-form"
        method="post"
        ref={formEl}
      >
        <div className="field">
          <label>Card Number</label>
          <div className="ui input" id="card-number" />
        </div>
        <div className="field">
          <label>CVV</label>
          <div className="ui input">
            <div id="cvv" />
          </div>
        </div>
        <div className="field">
          <label>Expiration Date</label>
          <div className="ui input">
            <div id="expiration-date" />
          </div>
        </div>
        <input
          className="ui button"
          type="submit"
          value="Pay"
          ref={inputEl}
          disabled={!fieldsVisible}
        />
      </form>
      {/* <form id="hosted-fields-form" method="post" ref={formEl}>
        <label htmlFor="card-number">Card Number</label>
        <div id="card-number" />

        <label htmlFor="cvv">CVV</label>
        <div id="cvv" />

        <label htmlFor="expiration-date">Expiration Date</label>
        <div id="expiration-date" />

        <input type="submit" value="Pay" ref={inputEl} disabled />
      </form> */}
      {successMessage && (
        <>
          <h1>Success</h1>
          <p>
            Your Hosted Fields form is working! Check your{' '}
            <a href="https://sandbox.braintreegateway.com/login">
              sandbox Control Panel
            </a>{' '}
            for your test transactions.
          </p>
          <p>Refresh to try another transaction.</p>
        </>
      )}
      {errorMessage && (
        <>
          <h1>Error</h1>
          <p>Check your console.</p>
        </>
      )}
    </div>
  );
}

const mapStateToProps = ({ csrf }) => ({
  csrf,
});

export default connect(mapStateToProps, null)(BrainTree);
