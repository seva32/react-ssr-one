/* eslint-disable no-console */
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import fingerprint from 'express-fingerprint';
import helmet from 'helmet';

import { cookiesOptions } from './contollers/config';
import { cors, store, csurf as csrfProtection } from './middleware';
import { authRouter, authFilterRouter, usersRouter } from './router';

dotenv.config({ silent: true });

const server = express();
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

server.options('*', cors);
server.use(csrfProtection);
process.env.NODE_ENV === 'production' &&
  server.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

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
/* Proxy in heroku */
// tell express to trust the information in the X-Forwarded-Proto
// header, i.e. that the original request was over https (4 heroku)
// server.set('trust proxy', 1);

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

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
    'X-Access-Token, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization, refreshToken, seva, CSRF-Token',
  );

  next();
});

server.use('/auth', authRouter);
server.use(authFilterRouter);
server.use('/users', usersRouter);
server.use(store());

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