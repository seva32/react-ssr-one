/* eslint-disable no-console */
import dotenv from 'dotenv';
import express from 'express';
import path from 'path'; // eslint-disable-line
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';

import authRouter from './authRouter';

dotenv.config({ silent: true });

const MongoStore = require('connect-mongo')(session);

mongoose.connect(process.env.MONGOOSE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const server = express();

const { API_PORT } = process.env;

server.set('x-powered-by', false);
server.use(bodyParser.json({ type: '*/*' }));
server.use(cors());

server.use(
  session({
    secret: process.env.LOGIN_SERVER_SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    saveUninitialized: true,
    resave: true,
    cookie: {
      httpOnly: false,
      secure: false,
    },
  }),
);

authRouter(server);

server.get('/cookie', (req, res) => {
  const options = {
    secure: false,
    httpOnly: false,
    // domain: '.your.domain.com',
  };
  if (!req.isAuthenticated()) {
    return res.status(400).send('Unauthorized');
  }
  return res
    .cookie('Secure', 'Secure', options)
    .status(200)
    .send('cookie sent');
});

server.listen(API_PORT, () => {
  console.log(
    `Server listening on \x1b[42m\x1b[1mhttp://localhost:${API_PORT}\x1b[0m in \x1b[41m${process.env.NODE_ENV}\x1b[0m 🌎...`,
  );
});
