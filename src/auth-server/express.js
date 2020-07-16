/* eslint-disable no-console */
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path'; // eslint-disable-line
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

import authRouter from './authRouter';

dotenv.config({ silent: true });

mongoose.connect(process.env.MONGOOSE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const server = express();

const { API_PORT } = process.env;

server.set('x-powered-by', false);
server.use(bodyParser.json({ type: '*/*' }));
server.use(cookieParser());
server.use(cors());

authRouter(server);

server.listen(API_PORT, () => {
  console.log(
    `Server listening on \x1b[42m\x1b[1mhttp://localhost:${API_PORT}\x1b[0m in \x1b[41m${process.env.NODE_ENV}\x1b[0m 🌎...`,
  );
});
