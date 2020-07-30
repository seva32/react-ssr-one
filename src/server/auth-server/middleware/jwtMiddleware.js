/* eslint-disable arrow-body-style */
/* eslint-disable consistent-return */
// the middleware attach the actual user to req
import { verifyJWTToken, verifyRefreshToken } from '../jwt/jwt';

// eslint-disable-next-line import/prefer-default-export
export function jwtMiddleware(req, res, next) {
  const token = req.get('x-access-token');

  // cliente sin accesstoken ni refresh token
  if (!token && !req.cookies.refreshToken) {
    return res.status(401).send({ message: 'Invalid credentials' });
  }

  // cliente se auth e hizo refresh/reload y/o api request
  if (req.cookies.refreshToken) {
    verifyRefreshToken(req.cookies.refreshToken, req.fingerprint)
      .then((newTokens) => {
        const cookiesOptions = {
          secure: false,
          httpOnly: false,
          domain: 'localhost',
        };
        console.log('refresh exitoso en path auth/ api auth!');

        res.cookie('refreshToken', newTokens.refreshToken, cookiesOptions);
        res.setHeader('x-update-token', newTokens.accessToken);
        // si hay access token valido es api request
        if (token) {
          verifyJWTToken(token)
            .then((accessTokenUserId) => {
              // esta situacion cuando consumo api no por navegacion api/users
              req.accessTokenUserId = accessTokenUserId;
              return next();
            })
            .catch((err) => {
              // accesstoken no valido
              return res.status(401).send({ message: err.message });
            });
        } else {
          // no existe access token pero si refreshtoken
          return next();
        }
      })
      .catch((err) => {
        return res.status(401).send({ message: err.message });
      });
  }
}
