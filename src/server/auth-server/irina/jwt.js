/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
// import { v1 as uuidv1 } from 'uuid';
import config from '../contollers/config';
import db from '../models/index';

const User = db.user;
const Token = db.token;

// eslint-disable-next-line import/prefer-default-export
export function getAccessToken(payload) {
  return jwt.sign({ id: payload }, config.secret, {
    expiresIn: 9000, // 15m
  });
}

export function getRefreshToken(payload, fingerprint) {
  // const { ObjectId } = require('mongoose').Types;
  // const objId = new ObjectId(payload);
  return new Promise((resolve) => {
    const {
      hash,
      components: {
        useragent: {
          browser: { family: browserfamily = 'unknown' } = {},
          os: { family: osfamily = 'unknown' } = {},
        } = {},
      },
    } = fingerprint;

    let userRefreshTokensArr;

    User.findOne({ _id: payload }, (err, user) => {
      if (err) {
        console.log(err);
        return;
      }

      userRefreshTokensArr = user.token;
      if (userRefreshTokensArr.length >= 5) {
        userRefreshTokensArr = userRefreshTokensArr.slice(-4);
      }

      const refreshToken = jwt.sign({ id: payload }, config.secret, {
        expiresIn: '15d', // 15m
      });

      new Token({
        refreshToken,
        hash,
        osfamily,
        browserfamily,
      }).save((error, token) => {
        if (error) {
          console.log('error', err);
        }

        userRefreshTokensArr.push(token);
        user.token = userRefreshTokensArr; // eslint-disable-line
        user.save((e) => {
          if (e) {
            console.log(e);
          }
          resolve(refreshToken);
        });
      });
    });
  });
}

export function verifyJWTToken(token) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line consistent-return
    jwt.verify(token, config.secret, (err, decodedToken) => {
      if (err) {
        return reject(new Error(err.message));
      } // Check the decoded user
      if (!decodedToken || !decodedToken.id) {
        return reject(new Error('Token is invalid'));
      }
      resolve(decodedToken.id);
    });
  });
}

export function processRefreshToken(token, fingerprint) {
  return new Promise((resolve, reject) => {
    const {
      hash,
      components: {
        useragent: {
          browser: { family: browserfamily = 'unknown' } = {},
          os: { family: osfamily = 'unknown' } = {},
        } = {},
      },
    } = fingerprint;
    // get decoded data
    const decodedToken = jwt.verify(token, config.secret);

    User.findOne({ _id: decodedToken.id }, (err, user) => {
      if (err) {
        return reject(new Error('Access is forbidden'));
      }

      if (!user.token.length) {
        return reject(new Error('Access is forbidden'));
      }

      Token.findOne({ refreshToken: token }, (e, rToken) => {
        if (e) {
          return reject(new Error('Refresh token doesnt exist'));
        }
        if (!rToken || rToken === undefined || rToken === null) {
          return reject(new Error('Refresh token doesnt exist'));
        }
        const newRefreshToken = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: '30d',
        });
        rToken.update(
          {
            refreshToken: newRefreshToken,
            hash,
            osfamily,
            browserfamily,
          },
          (error, _doc) => {
            if (error) {
              return reject(new Error('Refresh token doesnt exist'));
            }

            const newAccessToken = getAccessToken(user.id);
            return resolve({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            });
          },
        );
      });
    });
  });
}
