/* eslint-disable no-shadow */
/* eslint-disable object-shorthand */
import jwt from 'jwt-simple';
import User from '../models/user';
import config from './config';

// sub y iat son prop de jwt
const tokenForUser = (user) => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
};

// eslint-disable-next-line consistent-return
export const signup = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: 'email and pass required' });
  }
  // eslint-disable-next-line consistent-return
  User.findOne({ email: email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    // if exists->error
    if (existingUser) {
      return res.status(422).send({ error: 'email in use' });
    }
    // create and save the user
    const user = new User({ email: email, password: password });
    user
      .save()
      .then((user) => {
        res.json({ token: tokenForUser(user) });
      })
      .catch((err) => {
        next(err);
      });
  });
};

// eslint-disable-next-line no-unused-vars
export const signin = (req, res, next) => {
  // eslint-disable-next-line max-len
  // user ya paso email y pass auth, doy token, ya tengo al user en req.user xq passport lo agrega al pasar por done(null, user);
  res.send({ token: tokenForUser(req.user) });
};
