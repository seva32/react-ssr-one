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
import db from './models';
import initial from './models/initial';
import { processRefreshToken } from './jwt/jwt';
import config from './contollers/config';

dotenv.config({ silent: true });

const Role = db.role;
db.mongoose
  .connect(process.env.MONGOOSE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Successfully connect to MongoDB.');
    initial(Role);
  })
  .catch((err) => {
    console.error('Connection error', err);
    process.exit();
  });

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
  origin: /localhost/, // origin: /\.your.domain\.com$/
  methods: 'GET,HEAD,POST,PATCH,DELETE,OPTIONS',
  credentials: true, // required to pass allowedHeaders
};
// intercept pre-flight check for all routes
server.options('*', cors(corsOptions));

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

server.use(
  session({
    secret: process.env.LOGIN_SERVER_SECRET,
    store: new MongoStore({ url: process.env.MONGOOSE }),
    saveUninitialized: true,
    resave: true,
    cookie: {
      httpOnly: false,
      secure: false,
    },
    name: 'seva',
  }),
);

server.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept',
  );
  next();
});

// Authentication
server.post('/api/signup', [checkDuplicateEmail, checkRolesExisted], signup);
server.post('/api/signin', [cors(corsOptions)], signin);
server.post('/api/signout', [cors(corsOptions)], signout);

// eslint-disable-next-line consistent-return
server.use('/refresh-token', (req, res) => {
  const refreshToken =
    req.headers.cookie
      .split(';')
      .filter((c) => c.includes('refreshToken'))[0]
      .split('=')[1] || '';
  if (!refreshToken) {
    return res.status(403).send({ message: 'Access is forbidden' });
  }

  processRefreshToken(refreshToken, req.fingerprint)
    .then((tokens) => {
      const cookiesOptions = {
        secure: false,
        httpOnly: false,
        domain: 'localhost',
      };

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
  (req, res, next) => next(),
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
