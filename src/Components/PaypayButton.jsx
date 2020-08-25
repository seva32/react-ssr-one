/* eslint-disable implicit-arrow-linebreak */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const clientId =
  'AeppKdPmXFPtWDoU5izq8qNS_v2Wn1dWwdKHj0eAOGMkxA-nEruavRkOxxGDxhIg-eLx9pvoXPBPjVrO';
const currency = 'EUR';
const disableFunding = 'card,credit';
const locale = 'es_AR';

const PaypalButton = ({ onButtonReady }) => {
  const [sdkReady, setSdkReady] = useState(false);

  const addPaypalSdk = () => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&disable-funding=${disableFunding}&locale=${locale}`;
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
            // facilitatorAccessToken: "A21AAFOY8shskOucVHKS-
            // vawmqLz7VE55TyD0eN4sgRwNMksoaHxKOATo8m3Icj9WxZW2OV9kxLranpSLIuEPVYPdZ-YGYUtQ"
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
