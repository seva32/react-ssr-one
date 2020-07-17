/* eslint-disable consistent-return */
const express = require('express');

const router = express.Router();
const passport = require('passport');
const dotenv = require('dotenv');
const util = require('util');
const url = require('url');
const querystring = require('querystring');

dotenv.config();

// Perform the login, after login Auth0 will redirect to callback
router.get(
  '/login',
  passport.authenticate('auth0', {
    scope: 'openid email profile',
  }),
  (req, res) => {
    res.redirect('/');
  },
);

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', (req, res, next) => {
  // eslint-disable-next-line no-unused-vars
  passport.authenticate('auth0', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login');
    }
    req.logIn(user, (error) => {
      if (error) {
        return next(error);
      }
      const { returnTo } = req.session;
      delete req.session.returnTo;
      res.redirect(returnTo || '/user');
    });
  })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();

  let returnTo = `${req.protocol}://${req.hostname}`;
  const port = req.connection.localPort;
  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo += `:${port}`;
  }

  const logoutURL = new url.URL(
    util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN),
  );
  const searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo,
  });
  logoutURL.search = searchString;

  res.redirect(logoutURL);
});

module.exports = router;
