/* eslint-disable no-console */
import dotenv from 'dotenv';
import express from 'express';
import path from 'path'; // eslint-disable-line
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
// import cors from 'cors';
import fingerprint from 'express-fingerprint';
// import csrf from 'csurf';

import { signin, signup, signout } from './contollers/authController';
import {
  checkDuplicateEmail,
  checkRolesExisted,
} from './middleware/verifySignUp';
import { jwtMiddleware } from './middleware/jwtMiddleware';
// import db from './models';
// import initial from './models/initial';
import { processRefreshToken } from './jwt/jwt';
import config from './contollers/config';

dotenv.config({ silent: true });

const isProd = process.env.NODE_ENV === 'production';

// const Role = db.role;
// db.mongoose
//   .connect(process.env.MONGOOSE, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log('Successfully connect to MongoDB.');
//     initial(Role);
//   })
//   .catch((err) => {
//     console.error('Connection error', err);
//     process.exit();
//   });

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

// server.use(
//   cors({
//     credentials: true,
//     origin: ['http://localhost:8080', 'http://your-production-website.com'],
//   }),
// );

// const corsOptions = {
// eslint-disable-next-line max-len
//   origin: isProd ? new RegExp(process.env.SERVER_URL, 'g') : /localhost/, // origin: /\.your.domain\.com$/
//   methods: 'GET,HEAD,POST,PATCH,DELETE,OPTIONS',
//   credentials: true, // required to pass allowedHeaders
//   enablePreflight: true
// };
// intercept pre-flight check for all routes
// server.options('*', cors(corsOptions));

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
    cookie: {
      secure: isProd,
      httpOnly: isProd,
    },
    name: 'seva',
    path: '/',
  }),
);

server.use((req, res, next) => {
  // res.header('Access-Control-Allow-Credentials', true);
  // res.header(
  //   'Access-Control-Allow-Headers',
  //   'x-access-token, Origin, X-Requested-With, Content-Type, Accept',
  // );

  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin); // cambiar a api_server
  res.header(
    'Access-Control-Allow-Methods',
    'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
  );
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
  );

  next();
});

// Authentication
server.post('/api/signup', [checkDuplicateEmail, checkRolesExisted], signup);
// server.post('/api/signin', [cors(corsOptions)], signin);
// server.post('/api/signout', [cors(corsOptions)], signout);
server.post('/api/signin', signin);
server.post('/api/signout', signout);

// eslint-disable-next-line consistent-return
server.use('/refresh-token', (req, res) => {
  console.log('********************************************');
  console.log('********************************************');
  console.log(req);
  console.log('********************************************');
  console.log('********************************************');
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
        secure: isProd,
        httpOnly: isProd,
        domain: isProd ? process.env.SERVER_URL : 'localhost',
      };

      res.cookie('refreshToken', tokens.refreshToken, cookiesOptions);
      console.log('********************************************');
      console.log('********************************************');
      console.log(res);
      console.log('********************************************');
      console.log('********************************************');
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
  [jwtMiddleware],
  // [cors(corsOptions), jwtMiddleware],
  (req, res, next) => {
    // console.log('***** middle *****');
    // console.log(req.headers);
    // console.log(req.url);
    // console.log(req.originalUrl);
    // console.log(req.cookies);
    next();
  },
);

server.get('/api/users', (req, res, _next) => {
  // console.log('***** users *****');
  // console.log(req.headers);
  // console.log(req.url);
  // console.log(req.originalUrl);
  // console.log(req.cookies);
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
