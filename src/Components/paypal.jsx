/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable implicit-arrow-linebreak */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import './paypal.css';

const PaypalButton = ({ onButtonReady, csrf }) => {
  const [sdkReady, setSdkReady] = useState(false);
  // const [hfieldsElegible, setHfieldsElegible] = useState(false);
  const submitEl = React.createRef(null);

  const addPaypalSdk = (token) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src =
      'https://www.paypal.com/sdk/js?components=hosted-fields,buttons&client-id=AeppKdPmXFPtWDoU5izq8qNS_v2Wn1dWwdKHj0eAOGMkxA-nEruavRkOxxGDxhIg-eLx9pvoXPBPjVrO';
    script.async = true;
    script['data-client-token'] = token;
    script.onload = () => {
      setSdkReady(true);
    };
    script.onerror = () => {
      throw new Error('Paypal SDK could not be loaded. Script.');
    };
    document.body.appendChild(script);
  };

  const axiosinstance = React.useRef(null);

  useEffect(() => {
    if (window !== undefined && csrf) {
      const authHeader = require('../store/actions/users/auth-header').default;
      const defaultOptions = {
        // baseURL: 'http://localhost:8080',
        headers: authHeader(csrf),
      };
      axiosinstance.current = axios.create(defaultOptions);

      // get access token from server
      if (!sdkReady) {
        axiosinstance.current
          .get('http://localhost:8080/payment/create-access-token')
          .then(({ data: { data } }) => data.client_token)
          .then((token) => {
            addPaypalSdk(token);
          })
          .catch((e) => {
            console.log(e.message);
          });
      }
    }

    if (typeof window !== 'undefined' && sdkReady) {
      onButtonReady('Message for parent component.');

      window.paypal
        .Buttons({
          commit: false,
          createOrder(data, actions) {
            // This function sets up the details of the transaction,
            // including the amount and line item details
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: '2',
                  },
                },
              ],
            });
          },
          onCancel(data) {
            console.log('on cancel: ', data);
            // Show a cancel page, or return to cart
          },
          // aqui paypal recibe la order solo del cliente, no puedo guardarla en db
          onApprove(data, actions) {
            // data:
            // billingToken: null
            // facilitatorAccessToken: "A21AAFA1vtHjek2i329pL...UlVoycO16BxLfwPkX3EDRu4xuw"
            // orderID: "3XN16909EC3087418"
            // payerID: "FV226882NKSMA"
            // paymentID: null
            // This function captures the funds from the transaction
            return actions.order.capture().then((_details) => {
              // details
              // create_time: "2020-08-27T00:23:27Z"
              // id: "3XN16909EC3087418"
              // intent: "CAPTURE"
              // links: (1) […] 0: {…} href: "https://api.sandbox.paypal.com/v2/checkout/orders/3XN16909EC3087418"
              // method: "GET"
              // payer: {…}
              // address: Object { country_code: "US" }
              // email_address: "person@sebastianfantini.com"
              // name: Object { given_name: "hola", surname: "chau" }
              // payer_id: "FV226882NKSMA"
              // purchase_units: (1) […] 0: {…} amount: Obj { value: "2.00", currency_code: "USD" }
              // payee: Obj{ email_address: "business@seb...", merchant_id: "8WTP5WQJUEMSW" }
              // payments: Object { captures: (1) […] }
              // reference_id: "default"
              // shipping: Object { name: {…}, address: {…} }
              // soft_descriptor: "PAYPAL *SUSILUSTEST"
              // status: "COMPLETED"
              // update_time: "2020-08-27T00:26:11Z"

              // This function shows a transaction success message to your buyer
              alert('Thanks for your purchase!');
            });
          },
        })
        .render('#paypal-button-container');

      // Eligibility check for advanced credit and debit card payments (no 4 Arg)
      if (window.paypal.HostedFields.isEligible() && submitEl) {
        // setHfieldsElegible(true);
        window.paypal.HostedFields.render({
          createOrder() {
            // pedir order/transaction con la auth que tiene paypal cuando el cliente pago
            // return axiosinstance.current('/payment/create-paypal-transaction-auth', {

            // pedir solo la transaction
            return axiosinstance
              .current('/payment/create-paypal-transaction', {
                method: 'post',
                headers: {
                  'content-type': 'application/json',
                },
              })
              .then((res) => res.data)
              .then(
                (data) => data.orderID, // Use same key name for order ID on the client and server
              );
          },

          // server call to save order data to db
          // onApprove(data) {
          //   return axiosinstance
          //     .current('/payment/get-paypal-transaction', {
          //       headers: {
          //         'content-type': 'application/json',
          //       },
          //       body: JSON.stringify({
          //         orderID: data.orderID,
          //       }),
          //     })
          //     .then((res) => res.json())
          //     .then((details) => {
          //       alert(`Transaction approved by ${details.payer_given_name}`);
          //     });
          // },

          // Calls PayPal to capture the order and save to db y no directamente de cliente a paypal
          // onApprove(data) {
          //   return fetch('/payment/capture-paypal-transaction', {
          //     headers: {
          //       'content-type': 'application/json',
          //     },
          //     body: JSON.stringify({
          //       orderID: data.orderID,
          //     }),
          //   })
          //     .then((res) => res.json())
          //     .then((details) => {
          //       alert(
          //         `Transaction funds captured from ${details.payer_given_name}`,
          //       );
          //     });
          // },

          // Calls paypal to get the auth transaction od
          // onApprove: function(data) {
          //   return fetch('/payment/authorize-paypal-transaction', {
          //     method: 'post',
          //     headers: {
          //       'content-type': 'application/json'
          //     },
          //     body: JSON.stringify({
          //       orderID: data.orderID
          //     })
          //   }).then(function(res) {
          //     return res.json();
          //   }).then(function(details) {
          //     alert('Authorization created for ' + details.payer_given_name);
          //   });
          // }

          styles: {
            input: {
              'font-size': '17px',
              'font-family': 'helvetica, tahoma, calibri, sans-serif',
              color: '#3a3a3a',
            },
            ':focus': {
              color: 'black',
            },
          },
          fields: {
            number: {
              selector: '#card-number',
              placeholder: 'card number',
            },
            cvv: {
              selector: '#cvv',
              placeholder: 'card security number',
            },
            expirationDate: {
              selector: '#expiration-date',
              placeholder: 'mm/yy',
            },
          },
        }).then((hf) => {
          submitEl.current.submit((event) => {
            event.preventDefault();
            hf.submit({
              // Cardholder Name
              cardholderName: document.getElementById('card-holder-name').value,
              // Billing Address
              billingAddress: {
                streetAddress: document.getElementById(
                  'card-billing-address-street',
                ).value, // address_line_1 - street
                extendedAddress: document.getElementById(
                  'card-billing-address-unit',
                ).value, // address_line_2 - unit
                region: document.getElementById('card-billing-address-state')
                  .value, // admin_area_1 - state
                locality: document.getElementById('card-billing-address-city')
                  .value, // admin_area_2 - town / city
                postalCode: document.getElementById('card-billing-address-zip')
                  .value, // postal_code - postal_code
                countryCodeAlpha2: document.getElementById(
                  'card-billing-address-country',
                ).value, // country_code - country
              },
            });
          });
        });
      }
    }
  }, [csrf, sdkReady, onButtonReady, submitEl]);

  return (
    <div>
      <table
        border="0"
        align="center"
        valign="top"
        bgcolor="#FFFFFF"
        style={{ width: '39%' }}
      >
        <tbody>
          <tr>
            <td colSpan="2">
              <div id="paypal-button-container" />
            </td>
          </tr>
          <tr>
            <td colSpan="2">&nbsp;</td>
          </tr>
        </tbody>
      </table>

      {/* {hfieldsElegible && ( */}
      <>
        <div align="center"> or </div>

        <div className="card_container">
          <form id="my-sample-form">
            <label htmlFor="card-number">Card Number</label>
            <div id="card-number" className="card_field" />
            <div>
              <label htmlFor="expiration-date">Expiration Date</label>
              <div id="expiration-date" className="card_field" />
            </div>
            <div>
              <label htmlFor="cvv">CVV</label>
              <div id="cvv" className="card_field" />
            </div>
            <label htmlFor="card-holder-name">Name on Card</label>
            <input
              type="text"
              id="card-holder-name"
              name="card-holder-name"
              autoComplete="off"
              placeholder="card holder name"
            />
            <div>
              <label htmlFor="card-billing-address-street">
                Billing Address
              </label>
              <input
                type="text"
                id="card-billing-address-street"
                name="card-billing-address-street"
                autoComplete="off"
                placeholder="street address"
              />
            </div>
            <div>
              <label htmlFor="card-billing-address-unit">&nbsp;</label>
              <input
                type="text"
                id="card-billing-address-unit"
                name="card-billing-address-unit"
                autoComplete="off"
                placeholder="unit"
              />
            </div>
            <div>
              <input
                type="text"
                id="card-billing-address-city"
                name="card-billing-address-city"
                autoComplete="off"
                placeholder="city"
              />
            </div>
            <div>
              <input
                type="text"
                id="card-billing-address-state"
                name="card-billing-address-state"
                autoComplete="off"
                placeholder="state"
              />
            </div>
            <div>
              <input
                type="text"
                id="card-billing-address-zip"
                name="card-billing-address-zip"
                autoComplete="off"
                placeholder="zip / postal code"
              />
            </div>
            <div>
              <input
                type="text"
                id="card-billing-address-country"
                name="card-billing-address-country"
                autoComplete="off"
                placeholder="country code"
              />
            </div>
            <br />
            <br />
            <button
              value="submit"
              type="button"
              id="submit"
              className="btn"
              ref={submitEl}
            >
              Pay
            </button>
          </form>
        </div>
      </>
      {/* )} */}
    </div>
  );
};

const mapStateToProps = ({ csrf }) => ({
  csrf,
});

PaypalButton.propTypes = {
  onButtonReady: PropTypes.func,
  csrf: PropTypes.string,
};

PaypalButton.defaultProps = {
  onButtonReady: () => {},
  csrf: '',
};

export default connect(mapStateToProps, null)(PaypalButton);
        