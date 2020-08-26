/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import express from 'express';
import axios from 'axios';

const router = express.Router();
const PAYPAL_API = 'https://api.sandbox.paypal.com';

router.get('/create-access-token', (req, res) => {
  axios({
    url: 'https://api.sandbox.paypal.com/v1/identity/generate-token',
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'en_US',
    },
    auth: {
      username: process.env.PAYPAL_CLIENT,
      password: process.env.PAYPAL_SECRET,
    },
    data: { grant_type: 'client_credentials' },
  })
    .then(({ data }) => {
      console.log(data);
      res.send({ data });
      // data { client_token: ..., expires_in: 3600 }
      // axios({
      //   url: 'https://api.sandbox.paypal.com/v1/identity/generate-token',
      //   method: 'post',
      //   headers: {
      //     Accept: 'application/json',
      //     Authorization: `Bearer ${data.client_token}`,
      //     'Accept-Language': 'en_US',
      //   },
      // })
      //   // eslint-disable-next-line no-shadow
      //   .then(({ data }) => {
      //     console.log(data);
      //     return res.status(200).send({ data });
      //   })
      //   .catch((e) => res.status(401).send({ message: e.message }));
    })
    .catch((e) => {
      console.log(e.message);
      return res.status(401).send({ message: 'Unauthorized' });
    });
});

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

export default router;
