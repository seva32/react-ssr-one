/* eslint-disable no-console */
import dotenv from 'dotenv';
import express from 'express';
import path from 'path'; // eslint-disable-line
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fingerprint from 'express-fingerprint';
// import csrf from 'csurf';

import { signin, signup, signout } from './contollers/authController';
import {
  checkDuplicateEmail,
  checkRolesExisted,
} from './middleware/verifySignUp';
import { jwtMiddleware } from './middleware/jwtMiddleware';
import { processRefreshToken } from './jwt/jwt';
import config, { cookiesOptions } from './contollers/config';

dotenv.config({ silent: true });

const server = express();
server.set('x-powered-by', false);
server.use(bodyParser.json({ type: '*/*', limit: '10mb' }));
server.use(
  bodyParser.urlencoded({
    limit: '10mb',
    extended: true,
    parameterLimit: 50000,
  }),
);
server.use(cookieParser());
server.use(
  fingerprint({
    parameters: [fingerprint.useragent],
  }),
);

const corsOptions = {
  origin: [process.env.SERVER_URL, 'localhost'],
  methods: 'GET,HEAD,POST,PATCH,DELETE,OPTIONS',
  credentials: true, // required to pass allowedHeaders
  allowedHeaders: [
    'X-Access-Token',
    'X-Requested-With',
    'X-HTTP-Method-Override',
    'Content-Type',
    'Accept',
    'Authorization',
    'refreshToken',
    'seva',
  ],
  exposedHeaders: ['refreshToken', 'X-Access-Token', 'seva'],
};
// intercept pre-flight check for all routes
server.options('*', cors(corsOptions));

/* Redirect http to https in heroku */
// server.use('*', (req, res, next) => {
//   if (
//     req.headers['x-forwarded-proto'] !== 'https' &&
//     process.env.NODE_ENV === 'production'
//   ) {
//     res.redirect(`https://${req.hostname}${req.url}`);
//   }
//   next(); /* Continue to other routes if we're not redirecting */
// });

// falta impl en cliente
// const csrfProtection = csrf({
//   cookie: true,
// });
// server.use(csrfProtection);
// server.get('/csrf-token', (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// tell express to trust the information in the X-Forwarded-Proto
// header, i.e. that the original request was over https (4 heroku)
server.set('trust proxy', 1);

server.use(
  session({
    secret: process.env.LOGIN_SERVER_SECRET,
    store: new MongoStore({ url: process.env.MONGOOSE }),
    saveUninitialized: true,
    resave: true,
    cookie: cookiesOptions,
    name: 'seva',
    path: '/',
  }),
);

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', process.env.SERVER_URL); // cambiar a api_server
  res.header(
    'Access-Control-Allow-Methods',
    'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
  );
  res.header(
    'Access-Control-Allow-Headers',
    'X-Access-Token, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization, refreshToken, seva',
  );

  next();
});

// Authentication
server.post('/api/signup', [checkDuplicateEmail, checkRolesExisted], signup);
server.post('/api/signin', [cors(corsOptions)], signin);
server.post('/api/signout', [cors(corsOptions)], signout);

// eslint-disable-next-line consistent-return
server.use('/refresh-token', (req, res) => {
  console.log('1*************', req.cookies);
  console.log('2&&&&&&&&&&&&&', req.headers.cookie);

  const refreshToken =
    req.headers.cookie
      .split(';')
      .filter((c) => c.includes('refreshToken'))[0]
      .split('=')[1] || '';

  processRefreshToken(refreshToken, req.fingerprint)
    .then((tokens) => {
      res.cookie('refreshToken', tokens.refreshToken, cookiesOptions);
      return res.send({
        accessToken: tokens.accessToken,
        expiryToken: config.expiryToken,
      });
    })
    .catch((err) => {
      const message = (err && err.message) || err;
      res.status(403).send(message);
    });
});

// Authorization
server.get(
  ['/api/users', '/posts'],
  [cors(corsOptions), jwtMiddleware],
  (req, res, next) => {
    next();
  },
);

server.get('/api/users', (req, res, _next) => {
  res.send({ seb: 'data from seb' });
});

// error handler
server.use((err, req, res, next) => {
  if (err) {
    console.error(err.message);
    console.error(err.stack);
    const message = (err && err.message) || err;
    return res.status(500).send(message);
  }
  return next(); // never called =)
});

export default server;
