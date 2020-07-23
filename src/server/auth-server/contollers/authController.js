/* eslint-disable no-shadow */
// import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../models/index';
import { getAccessToken, getRefreshToken } from '../irina/jwt';

const User = db.user;
const Role = db.role;

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
            const refreshToken = getRefreshToken(user.id, req.fingerprint);

            const cookiesOptions = {
              secure: false,
              httpOnly: false,
              domain: 'localhost',
            };
            res.cookie('refreshToken', refreshToken, cookiesOptions);
            res.send({
              email: user.email,
              roles: user.roles,
              accessToken: token,
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
          const refreshToken = getRefreshToken(user.id, req.fingerprint);

          const cookiesOptions = {
            secure: false,
            httpOnly: false,
            domain: 'localhost',
          };
          res.cookie('refreshToken', refreshToken, cookiesOptions);
          res.send({
            email: user.email,
            roles: user.roles,
            accessToken: token,
          });
        });
      });
    }
  });
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
      getRefreshToken(user.id, req.fingerprint).then((refreshToken) => {
        const authorities = [];

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < user.roles.length; i++) {
          authorities.push(`ROLE_${user.roles[i].name.toUpperCase()}`);
        }

        const cookiesOptions = {
          secure: false,
          httpOnly: false,
          domain: 'localhost',
        };
        res.cookie('refreshToken', refreshToken, cookiesOptions);
        res.status(200).send({
          // eslint-disable-next-line no-underscore-dangle
          // id: user._id,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
    });
};
