/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import express from 'express';
import axios from 'axios';
import braintree from 'braintree';

const router = express.Router();
const PAYPAL_API = 'https://api.sandbox.paypal.com';

// router.post('/create-payment', (req, res) => {
//   console.log('llego el req');
//   res.send({ message: 'fun' });
// });

router.post('/create-payment/', (req, res) => {
  // try {
  //   const {
  //     // eslint-disable-next-line camelcase
  //     data: { access_token },
  //   } = await axios({
  //     url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
  //     method: 'post',
  //     headers: {
  //       Accept: 'application/json',
  //       'Accept-Language': 'en_US',
  //       'content-type': 'application/x-www-form-urlencoded',
  //     },
  //     auth: {
  //       username: process.env.PAYPAL_CLIENT,
  //       password: process.env.PAYPAL_SECRET,
  //     },
  //     params: {
  //       grant_type: 'client_credentials',
  //     },
  //   });

  //   console.log('access_token: ', access_token);
  // } catch (error) {
  //   console.error('error: ', error);
  // }

  axios({
    url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'en_US',
      'content-type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: process.env.PAYPAL_CLIENT,
      password: process.env.PAYPAL_SECRET,
    },
    params: {
      grant_type: 'client_credentials',
    },
  })
    .then(({ data: { access_token } }) => {
      axios
        .post(
          `${PAYPAL_API}/v1/payments/payment`,
          {
            auth: {
              user: process.env.PAYPAL_CLIENT,
              pass: process.env.PAYPAL_SECRET,
            },
            body: {
              intent: 'sale',
              payer: {
                payment_method: 'paypal',
              },
              transactions: [
                {
                  amount: {
                    total: '5.99',
                    currency: 'USD',
                  },
                },
              ],
              redirect_urls: {
                return_url: 'http://localhost:8080',
                cancel_url: 'http://localhost:8080/signin',
              },
            },
            json: true,
          },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${access_token}`,
            },
          },
        )
        .then((err, response) => {
          if (err) {
            console.error('Error callback######', err);
            return res.sendStatus(500);
          }
          // 3. Return the payment ID to the client
          res.json({
            id: response.body.id,
          });
        })
        .catch((e) => {
          console.log('Error create::::::::', e.message);
          return res.sendStatus(500);
        });
    })
    .catch((error) => {
      console.log('Error getting access_token: ', error);
      return res.sendStatus(500);
    });
});
// Execute the payment:
// 1. Set up a URL to handle requests from the PayPal button.
router.post('/execute-payment/', (req, res) => {
  // 2. Get the payment ID and the payer ID from the request body.
  const { paymentID } = req.body;
  const { payerID } = req.body;
  // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
  axios.post(
    `${PAYPAL_API}/v1/payments/payment/${paymentID}/execute`,
    {
      auth: {
        user: process.env.PAYPAL_CLIENT,
        pass: process.env.PAYPAL_SECRET,
      },
      body: {
        payer_id: payerID,
        transactions: [
          {
            amount: {
              total: '10.99',
              currency: 'USD',
            },
          },
        ],
      },
      json: true,
    },
    (err, _response) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      // 4. Return a success response to the client
      res.json({
        status: 'success',
      });
    },
  );
});

const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

router.get('/client_token', (req, res) => {
  try {
    gateway.clientToken.generate({}, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Card number: 4111 1111 1111 1111
// Expiry: 09/20
// CVV: 400
// Postal Code: 40000

router.post('/sandbox', async (req, res) => {
  try {
    // Use the payment method nonce here
    const nonceFromTheClient = req.body.paymentMethodNonce;
    // Create a new transaction for $10
    const newTransaction = gateway.transaction.sale(
      {
        amount: '10.00',
        paymentMethodNonce: nonceFromTheClient,
        options: {
          // This option requests the funds from the transaction once it has been
          // authorized successfully
          submitForSettlement: true,
        },
      },
      (error, result) => {
        if (result) {
          res.send(result);
        } else {
          res.status(500).send(error);
        }
      },
    );
  } catch (err) {
    // Deal with an error
    console.log(err);
    res.send(err);
  }
});

export default router;
