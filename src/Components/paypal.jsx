/* eslint-disable implicit-arrow-linebreak */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import axios from 'axios';

const PaypalButton = ({ onButtonReady }) => {
  const [sdkReady, setSdkReady] = useState(false);

  const addPaypalSdk = () => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src =
      'https://www.paypal.com/sdk/js?client-id=AeppKdPmXFPtWDoU5izq8qNS_v2Wn1dWwdKHj0eAOGMkxA-nEruavRkOxxGDxhIg-eLx9pvoXPBPjVrO';
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    script.onerror = () => {
      throw new Error('Paypal SDK could not be loaded.');
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (window !== undefined && window.paypal === undefined) {
      addPaypalSdk();
    } else if (
      window !== undefined &&
      window.paypal !== undefined &&
      sdkReady
    ) {
      window.paypal
        .Buttons({
          createOrder(data, actions) {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: '0.01',
                  },
                },
              ],
            });
          },
          onApprove(data, actions) {
            // Data:
            // billingToken: null
            // facilitatorAccessToken: "A21AAFOY8shskOucVHKS-vawmqLz7VE55TyD0eN4sgRwNMksoaHxKOATo8m3Icj9WxZW2OV9kxLranpSLIuEPVYPdZ-YGYUtQ"
            // orderID: "64X33335KF5532355"
            // payerID: "FV226882NKSMA"
            // paymentID: null
            return actions.order.capture().then((details) => {
              // eslint-disable-next-line no-alert
              alert(
                `Transaction completed by ${details.payer.name.given_name}`,
              );
            });
          },
        })
        .render('#paypal-button-container');
      onButtonReady('Message for parent');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdkReady]);

  // let instance = null;
  // // eslint-disable-next-line react/destructuring-assignment
  // if (typeof window !== 'undefined' && props.csrf) {
  //   const authHeader = require('../store/actions/users/auth-header').default;
  //   const defaultOptions = {
  //     baseURL: 'http://localhost:8080',
  //     headers: authHeader(props.csrf),
  //   };
  //   instance = axios.create(defaultOptions);
  // }

  // useEffect(() => {
  //   if (window !== undefined && window.paypal === undefined) {
  //     addPaypalSdk();
  //   } else if (
  //     window !== undefined &&
  //     window.paypal !== undefined &&
  //     // eslint-disable-next-line react/prop-types
  //     props.onButtonReady
  //   ) {
  //     // eslint-disable-next-line react/prop-types
  //     props.onButtonReady();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // amount goes in the value field we will use props of the button for this
  //   const createOrder = (data, actions) =>
  //     actions.order.create({
  //       purchase_units: [
  //         {
  //           amount: {
  //             currency_code: 'USD',
  //             value: props.amount,
  //           },
  //         },
  //       ],
  //     });

  //   const onApprove = (data, actions) =>
  //     actions.order
  //       .capture()
  //       .then((details) => {
  //         if (props.onSuccess) {
  //           return props.onSuccess(data);
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });

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
  //     '#paypal-button',
  //   );
  // }

  return (
    // eslint-disable-next-line react/self-closing-comp
    <div id="paypal-button-container"></div>
  );
};

const mapStateToProps = ({ csrf }) => ({
  csrf,
});

PaypalButton.propTypes = {
  onButtonReady: PropTypes.func,
};

PaypalButton.defaultProps = {
  onButtonReady: () => {},
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
