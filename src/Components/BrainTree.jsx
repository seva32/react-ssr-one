/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */

import React, { Component } from 'react';
import 'braintree-web';
import axios from 'axios';
import DropIn from 'braintree-web-drop-in-react';

class App extends Component {
  instance;

  // eslint-disable-next-line react/state-in-constructor
  state = {
    clientToken: null,
  };

  async componentDidMount() {
    try {
      // Get a client token for authorization from your server
      const response = await axios.get(
        'http://localhost:8080/paypal/client_token',
      );
      const { clientToken } = response.data;

      this.setState({ clientToken });
    } catch (err) {
      console.error(err);
    }
  }

  async buy() {
    try {
      // Send the nonce to your server
      const { nonce } = await this.instance.requestPaymentMethod();
      const response = await axios.post(
        'http://localhost:5000/paypal/sandbox',
        nonce,
      );
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    if (!this.state.clientToken) {
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      );
    }
    return (
      <div>
        <DropIn
          options={{
            authorization: this.state.clientToken,
          }}
          // eslint-disable-next-line no-return-assign
          onInstance={(instance) => (this.instance = instance)}
        />
        <button type="button" onClick={this.buy.bind(this)}>
          Buy
        </button>
      </div>
    );
  }
}

export default App;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { connect } from 'react-redux';

// function BrainTreeButton(props) {
//   const [sdkReady, setSdkReady] = useState(false);

//   const addBrainTreeSdk = async () => {
//     const script = document.createElement('script');
//     script.type = 'text/javascript';
//     script.src =
//       'https://js.braintreegateway.com/web/dropin/1.23.0/js/dropin.min.js';
//     script.async = true;
//     script.onload = () => {
//       setSdkReady(true);
//     };
//     document.body.appendChild(script);
//   };

//   let instanceAxios = null;
//   // eslint-disable-next-line react/destructuring-assignment
//   if (typeof window !== 'undefined' && props.csrf) {
//     const authHeader = require('../store/actions/users/auth-header').default;
//     const defaultOptions = {
//       baseURL: 'http://localhost:8080',
//       headers: authHeader(props.csrf),
//     };
//     instanceAxios = axios.create(defaultOptions);
//   }

//   useEffect(() => {
//     if (typeof window !== 'undefined' && !window.braintree) {
//       addBrainTreeSdk();
//     }

//     return () => {
//       //
//     };
//   });

//   const onClick = async () => {
//     try {
//       const response = await instanceAxios.get('/paypal/client_token');
//       window.braintree.dropin.create(
//         {
//           authorization: response.data,
//           container: '#dropin-container',
//         },
//         (createErr, instance) => {
//           if (createErr) {
//             console.log('createErr:::::', createErr);
//           }
//           instance.requestPaymentMethod((err, payload) => {
//             if (err) {
//               console.log('error:::::', err.message);
//             }
//             console.log('payload:::::', payload);
//           });
//         },
//       );
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   if (!sdkReady) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <div id="dropin-container" />
//       <button type="submit" onClick={onClick}>
//         Request payment method
//       </button>
//     </>
//   );
// }

// const mapStateToProps = ({ csrf }) => ({
//   csrf,
// });

// export default connect(mapStateToProps, null)(BrainTreeButton);
