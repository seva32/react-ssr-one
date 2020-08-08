/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
import bcrypt from 'bcryptjs';
import db from '../models/index';
import config, { cookiesOptions } from './config';
import {
  getAccessToken,
  getRefreshToken,
  processRefreshToken,
} from '../jwt/jwt';

const User = db.user;
const Role = db.role;
const Token = db.token;

export const signup = (req, res) => {
  const user = new User({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            const token = getAccessToken(user.id);
            getRefreshToken(user.id, req.fingerprint)
              .then((refreshToken) => {
                res.cookie('refreshToken', refreshToken, cookiesOptions);
                res.send({
                  email: user.email,
                  roles: user.roles,
                  accessToken: token,
                  expiryToken: config.expiryToken,
                });
              })
              .catch((error) => {
                res.status(500).send({ message: error });
              });
          });
        },
      );
    } else {
      Role.findOne({ name: 'user' }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          const token = getAccessToken(user.id);
          getRefreshToken(user.id, req.fingerprint)
            .then((refreshToken) => {
              res.cookie('refreshToken', refreshToken, cookiesOptions);
              res.send({
                email: user.email,
                roles: user.roles,
                accessToken: token,
                expiryToken: config.expiryToken,
              });
            })
            .catch((error) => {
              res.status(500).send({ message: error });
            });
        });
      });
    }
  });
};

// signout controller to handle refreshToken deletion on singout redux action
export const signout = (req, res) => {
  if (req.cookies.refreshToken) {
    Token.findOne({ refreshToken: req.cookies.refreshToken }, (err, token) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      if (!token) {
        return res.status(404).send({ message: 'Refresh token Not found.' });
      }

      if (req.body.email) {
        User.findOne({ email: req.body.email }, (err, user) => {
          if (err) {
            return res.status(500).send({
              message: err,
            });
          }
          if (!user) {
            return res.status(404).send({
              message: 'User Not found.',
            });
          }

          user.token = user.token.filter((u) => !u.equals(token._id)); // eslint-disable-line

          user.save((err) => {
            if (err) {
              return res.status(500).send({
                message: err,
              });
            }
            Token.deleteOne(
              {
                _id: token._id,
              },
              (err) => {
                if (err) {
                  return res.status(500).send({
                    message: err,
                  });
                }
                return res.send({
                  ok: 'ok',
                });
              },
            );
          });
        });
      } else {
        // no email in req body
        return res.status(404).send({ message: 'No email provided.' });
      }
    });
  } else {
    // no cookie.refreshToken
    return res.status(404).send({ message: 'Action forbidden.' });
  }
};

export const signin = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .populate('roles', '-__v')
    .exec(async (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        res.status(404).send({ message: 'User Not found.' });
        return;
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password,
      );

      if (!passwordIsValid) {
        res.status(401).send({
          accessToken: null,
          message: 'Invalid Password!',
        });
        return;
      }

      const token = getAccessToken(user.id);
      getRefreshToken(user.id, req.fingerprint)
        .then((refreshToken) => {
          const authorities = [];

          for (let i = 0; i < user.roles.length; i++) {
            authorities.push(`ROLE_${user.roles[i].name.toUpperCase()}`);
          }

          res.cookie('refreshToken', refreshToken, cookiesOptions);
          res.status(200).send({
            email: user.email,
            roles: authorities,
            accessToken: token,
            expiryToken: config.expiryToken,
          });
        })
        .catch((error) => {
          res.status(500).send({ message: error });
        });
    });
};

export const refreshTokenController = (req, res) => {
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
};
