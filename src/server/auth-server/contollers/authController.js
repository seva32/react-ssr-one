/* eslint-disable no-shadow */
import bcrypt from 'bcryptjs';
import db from '../models/index';
import config, { cookiesOptions } from './config';
import { getAccessToken, getRefreshToken } from '../jwt/jwt';

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

          user.roles = roles.map((role) => role._id); // eslint-disable-line
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

        user.roles = [role._id]; // eslint-disable-line
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
// eslint-disable-next-line consistent-return
export const signout = (req, res) => {
  if (req.cookies.refreshToken) {
    // eslint-disable-next-line consistent-return
    Token.findOne(
      { refreshToken: req.cookies.refreshToken },
      // eslint-disable-next-line consistent-return
      (err, token) => {
        if (err) {
          return res.status(500).send({ message: err });
        }
        if (!token) {
          return res.status(404).send({ message: 'Refresh token Not found.' });
        }

        if (req.body.email) {
          // eslint-disable-next-line consistent-return
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

            // eslint-disable-next-line no-underscore-dangle
            user.token = user.token.filter((u) => !u.equals(token._id)); // eslint-disable-line

            // eslint-disable-next-line consistent-return
            user.save((err) => {
              if (err) {
                return res.status(500).send({
                  message: err,
                });
              }
              Token.deleteOne(
                {
                  // eslint-disable-next-line no-underscore-dangle
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
      },
    );
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

          // eslint-disable-next-line no-plusplus
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
