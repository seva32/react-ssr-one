/* eslint-disable no-console */
import dotenv from 'dotenv';
import express from 'express';
import path from 'path'; // eslint-disable-line
// import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// import passport from 'passport';
// import { signup, signin } from './contollers/authentications';
import { signin, signup } from './contollers/authController';
import {
  checkDuplicateEmail,
  checkRolesExisted,
} from './middleware/verifySignUp';
import { verifyToken } from './middleware/authJWT';
// import passportConfig from './passport'; // eslint-disable-line
import db from './models';
import initial from './models/initial';

const Role = db.role;

dotenv.config({ silent: true });

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

// const requireSignin = passport.authenticate('local', {
//   session: false,
// });

const server = express();

server.set('x-powered-by', false);
server.use(bodyParser.json({ type: '*/*' }));
server.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
server.use(cookieParser());

// const corsOptions = {
//   origin: 'http://localhost:8080',
// };
// server.use(cors(corsOptions));

const corsOptions = {
  // origin: /\.your.domain\.com$/,
  origin: /localhost/,
  methods: 'GET,HEAD,POST,PATCH,DELETE,OPTIONS',
  credentials: true, // required to pass allowedHeaders:
  // "Content-Type, Authorization, X-Requested-With",
};
// intercept pre-flight check for all routes
server.options('*', cors(corsOptions));

// express-session para passport.session (aqui local es session: false)
// const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
// server.use(
//   session({
//     secret: process.env.LOGIN_SERVER_SECRET,
//     store: new MongoStore({ mongooseConnection: mongoose.connection }),
//     saveUninitialized: true,
//     resave: true,
//     cookie: {
//       httpOnly: false,
//       secure: false,
//     },
//   }),
// );

// server.get('/api/auth', (req, res, next) => {
//   req.session.user = 'Seb'; // los otros middle puede usar el objeto session
//   next();
// });

// server.get('/cookie', (req, res) => {
//   const options = {
//     secure: false,
//     httpOnly: false,
//     domain: '.your.domain.com',
//   };
//   if (!req.isAuthenticated()) {
//     return res.status(400).send('Unauthorized');
//   }
//   return res
//     .cookie('Secure', 'Secure', options)
//     .status(200)
//     .send('cookie sent');
// });

server.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept',
  );
  next();
});

// Authentication
server.post('/api/signup', [checkDuplicateEmail, checkRolesExisted], signup);
server.post('/api/signin', cors(corsOptions), signin);

// Authorization
server.use('/posts', [verifyToken], (req, res, next) => {
  next();
});

export default server;
