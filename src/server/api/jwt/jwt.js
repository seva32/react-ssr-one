/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import config from '../contollers/config';
import db from '../models/index';

const User = db.user;
const Token = db.token;

export function getAccessToken(payload) {
  return jwt.sign({ id: payload }, config.secret, {
    expiresIn: config.expiryToken,
  });
}

// promise based to check that new refresh token got saved in db
// fingerprint to add extra security check
export function getRefreshToken(payload, fingerprint) {
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

    // the user may started different sessions on diff devices
    // if accessToken expires check to delete prev refreshtokens
    let userRefreshTokensArr;

    User.findOne({ _id: payload }, (err, user) => {
      if (err) {
        return reject(new Error(err));
      }

      userRefreshTokensArr = user.token;
      if (userRefreshTokensArr.length >= 5) {
        userRefreshTokensArr = userRefreshTokensArr.slice(-4); // up to 5 sessions active
      } // this 4 and the new one

      const refreshToken = jwt.sign({ id: payload }, config.secret, {
        expiresIn: config.expiryRefreshToken,
      });

      new Token({
        refreshToken,
        hash,
        osfamily,
        browserfamily,
      }).save((error, token) => {
        if (error) {
          return reject(new Error(error));
        }

        userRefreshTokensArr.push(token);
        user.token = userRefreshTokensArr; // eslint-disable-line
        user.save((e) => {
          if (e) {
            return reject(new Error(e));
          }
          return resolve(refreshToken);
        });
      });
    });
  });
}

export function verifyJWTToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secret, (err, decodedToken) => {
      if (err) {
        return reject(new Error(`Access token: ${err.message}`));
      }
      if (!decodedToken || !decodedToken.id) {
        return reject(new Error('Access token is invalid'));
      }
      return resolve(decodedToken.id);
    });
  });
}

export function verifyRefreshToken(token, fingerprint) {
  return new Promise((resolve, reject) => {
    Token.findOne({ refreshToken: token }, (e, rToken) => {
      if (e) {
        return reject(new Error(e.message));
      }
      if (!rToken || rToken === undefined || rToken === null) {
        return reject(new Error('Refresh token doesnt exist'));
      }

      jwt.verify(rToken.refreshToken, config.secret, (err, decodedToken) => {
        if (err) {
          return reject(new Error(`Refresh token: ${err.message}`));
        }
        if (!decodedToken || !decodedToken.id) {
          return reject(new Error('Refresh token is invalid'));
        }

        // si el refresh token es valido actualizarlo
        processRefreshToken(token, fingerprint)
          .then((tokens) => resolve(tokens))
          .catch((error) => reject(new Error(error.message)));
      });
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

    const decodedToken = jwt.verify(token, config.secret);

    User.findOne({ _id: decodedToken.id }, (err, user) => {
      if (err) {
        return reject(new Error('Internal server error'));
      }

      if (!user.token.length) {
        return reject(new Error('No refresh token, access forbidden'));
      }

      Token.findOne({ refreshToken: token }, (e, rToken) => {
        if (e) {
          return reject(new Error('Internal server error'));
        }
        if (!rToken || rToken === undefined || rToken === null) {
          return reject(new Error('Refresh token doesnt exist'));
        }
        const newRefreshToken = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: config.expiryRefreshToken,
        });
        rToken.updateOne(
          {
            refreshToken: newRefreshToken,
            hash,
            osfamily,
            browserfamily,
          },
          (error, _doc) => {
            if (error) {
              return reject(new Error('Refresh token failure'));
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
