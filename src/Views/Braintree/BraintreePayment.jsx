import React from 'react';
import BrainTree from '../../Components/Braintree';

function BraintreePayment() {
  const [visible, setVisible] = React.useState(false);
  const onButtonReady = () => {
    setVisible(true);
    console.log(visible);
  };

  return (
    <div>
      <BrainTree onButtonReady={onButtonReady} />
    </div>
  );
}

export default BraintreePayment;
