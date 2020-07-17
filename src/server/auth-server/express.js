/* eslint-disable no-console */
const dotenv = require('dotenv');
const express = require('express');
const path = require('path'); // eslint-disable-line
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const { signup, signin } = require('./contollers/authentications');
const passportConfig = require('./passport'); // eslint-disable-line

dotenv.config({ silent: true });

mongoose.connect(process.env.MONGOOSE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const requireSignin = passport.authenticate('local', {
  session: false,
});

const server = express();

server.set('x-powered-by', false);
server.use(bodyParser.json({ type: '*/*' }));
server.use(cookieParser());
server.use(cors());

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

server.post('/api/signup', signup);
server.post('/api/signin', requireSignin, signin);

module.exports = server;
