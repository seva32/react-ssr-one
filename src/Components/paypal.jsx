/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable implicit-arrow-linebreak */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

const PaypalButton = ({ onButtonReady, csrf }) => {
  const [sdkReady, setSdkReady] = useState(false);

  const addPaypalSdk = (token) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src =
      'https://www.paypal.com/sdk/js?components=hosted-fields,buttons&client-id=AeppKdPmXFPtWDoU5izq8qNS_v2Wn1dWwdKHj0eAOGMkxA-nEruavRkOxxGDxhIg-eLx9pvoXPBPjVrO';
    script.async = true;
    script['data-client-token'] = token;
    script.onload = () => {
      setSdkReady(true);
      return { ok: 'ok' };
    };
    script.onerror = () => {
      throw new Error('Paypal SDK could not be loaded.');
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [csrf]);

  if (
    typeof window !== 'undefined' &&
    !sdkReady &&
    axiosinstance.current !== null
  ) {
    // eslint-disable-next-line react/prop-types
    axiosinstance.current
      .get('http://localhost:8080/payment/create-access-token')
      .then(async ({ data }) => {
        console.log(data);

        if (data.access_token) {
          setSdkReady(true);
        }
        try {
          const result = await addPaypalSdk(data.access_token);
        } catch (e) {
          throw new Error('Paypal SDK could not be loaded.');
        }

        console.log(result);
        const submitEl = document.querySelector('#submit');

        window.paypal
          .Buttons({
            commit: false,
            // eslint-disable-next-line no-shadow
            createOrder(data, actions) {
              console.log('create order: ', data);
              // This function sets up the details of the transaction, including the amount and line item details
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
            // eslint-disable-next-line no-shadow
            onCancel(data) {
              console.log('on cancel: ', data);
              // Show a cancel page, or return to cart
            },
            // eslint-disable-next-line no-shadow
            onApprove(data, actions) {
              console.log('order data: ', data);
              // This function captures the funds from the transaction
              return actions.order.capture().then((details) => {
                console.log(details);
                // This function shows a transaction success message to your buyer
                alert('Thanks for your purchase!');
              });
            },
          })
          .render('#paypal-button-container');
        // Eligibility check for advanced credit and debit card payments
        if (window.paypal.HostedFields.isEligible()) {
          window.paypal.HostedFields.render({
            createOrder() {
              return 'order-ID';
            }, // replace order-ID with the order ID
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
            submitEl.submit((event) => {
              event.preventDefault();
              hf.submit({
                // Cardholder Name
                cardholderName: document.getElementById('card-holder-name')
                  .value,
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
                  postalCode: document.getElementById(
                    'card-billing-address-zip',
                  ).value, // postal_code - postal_code
                  countryCodeAlpha2: document.getElementById(
                    'card-billing-address-country',
                  ).value, // country_code - country
                },
              });
            });
          });
        } else {
          submitEl.disabled = true;
          throw new Error('Paypal could not be loaded. Unauthorized.');
        }
      })
      .catch((e) => {
        console.log(e.message);
        throw new Error('Paypal could not be loaded. Unauthorized.');
      });
  }

  // amount goes in the value field we will use props of the button for this
  // const createOrder = (data, actions) =>
  //   actions.order.create({
  //     purchase_units: [
  //       {
  //         amount: {
  //           currency_code: 'USD',
  //           value: props.amount,
  //         },
  //       },
  //     ],
  //   });

  // const onApprove = (data, actions) =>
  //   actions.order
  //     .capture()
  //     .then((details) => {
  //       if (props.onSuccess) {
  //         return props.onSuccess(data);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  // if (
  //   typeof window === 'undefined' ||
  //   (!sdkReady && window.paypal === undefined)
  // ) {
  //   return <div>Loading...</div>;
  // }

  // if (window.paypal && window.paypal.Button && instance) {
  //   window.paypal.Button.render(
  //     {
  //       env: 'sandbox', // Or 'production'
  //       // Set up the payment:
  //       // 1. Add a payment callback
  //       payment(data, _actions) {
  //         // 2. Make a request to your server
  //         return instance
  //           .post('/paypal/create-payment')
  //           .then(
  //             (res) => console.log(res.id),
  //             // 3. Return res.id from the response
  //             //   res.id,
  //           )
  //           .catch((e) => console.log(e));
  //       },
  //       // Execute the payment:
  //       // 1. Add an onAuthorize callback
  //       onAuthorize(data, _actions) {
  //         // 2. Make a request to your server
  //         return axios
  //           .post('/paypal/execute-payment/', {
  //             paymentID: data.paymentID,
  //             payerID: data.payerID,
  //           })
  //           .then((res) => {
  //             // 3. Show the buyer a confirmation message.
  //             console.log(res.body);
  //           })
  //           .catch((e) => console.log(e));
  //       },
  //     },
  //     '#paypal-button-container',
  //   );
  // }

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
            <label htmlFor="card-billing-address-street">Billing Address</label>
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
          <button value="submit" type="button" id="submit" className="btn">
            Pay
          </button>
        </form>
      </div>
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

// import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom';

// const PaypalButton = (props) => {
//   const [sdkReady, setSdkReady] = useState(false);

//   const addPaypalSdk = () => {
//     const clientID = 'Your-Paypal-Client-ID';
//     const script = document.createElement('script');
//     script.type = 'text/javascript';
//     script.src = `https://www.paypal.com/sdk/js?client-id=${clientID}`;
//     script.async = true;
//     script.onload = () => {
//       setSdkReady(true);
//     };
//     script.onerror = () => {
//       throw new Error('Paypal SDK could not be loaded.');
//     };

//     document.body.appendChild(script);
//   };

//   useEffect(() => {
//     if (window !== undefined && window.paypal === undefined) {
//       addPaypalSdk();
//     } else if (
//       window !== undefined &&
//       window.paypal !== undefined &&
//       props.onButtonReady
//     ) {
//       props.onButtonReady();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   //amount goes in the value field we will use props of the button for this
//   const createOrder = (data, actions) => {
//     return actions.order.create({
//       purchase_units: [
//         {
//           amount: {
//             currency_code: 'USD',
//             value: props.amount,
//           },
//         },
//       ],
//     });
//   };

//   const onApprove = (data, actions) => {
//     return actions.order
//       .capture()
//       .then((details) => {
//         if (props.onSuccess) {
//           return props.onSuccess(data);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   if (!sdkReady && window.paypal === undefined) {
//     return <div>Loading...</div>;
//   }

//   const Button = window.paypal.Buttons.driver('react', {
//     React,
//     ReactDOM,
//   });

// you can set your style to whatever read the documentation
// for different styles I have put some examples in the style tag
//   return (
//     <Button
//       {...props}
//       createOrder={
//         amount && !createOrder
//           ? (data, actions) => createOrder(data, actions)
//           : (data, actions) => createOrder(data, actions)
//       }
//       onApprove={
//         onSuccess
//           ? (data, actions) => onApprove(data, actions)
//           : (data, actions) => onApprove(data, actions)
//       }
//       style={{
//         layout: 'vertical',
//         color: 'blue',
//         shape: 'rect',
//         label: 'paypal',
//       }}
//     />
//   );
// };

// export default PaypalButton;

// Then you can use this in your component like so:

// const onSuccess = payment => {
//   console.log(payment)
// }

// const onCancel = data => {
//   console.log(data)
// };

// const onError = err => {
//   console.log(err);
// };

// <PaypalButton
//   amount="1.00"
//   onError={onError}
//   onSuccess={onSuccess}
//   onCancel={onCancel}
// />
