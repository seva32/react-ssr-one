/* eslint-disable arrow-body-style */
/* eslint-disable consistent-return */
// the middleware attach the actual user to req
import { verifyJWTToken, verifyRefreshToken } from '../jwt/jwt';

const isProd = process.env.NODE_ENV === 'production';

// eslint-disable-next-line import/prefer-default-export
export function jwtMiddleware(req, res, next) {
  // refresh token tiene que estar siempre presente si el
  // cliente esta auth, en cambio access token puede faltar
  // en un reload/refresh
  const token = req.get('x-access-token');

  // cliente sin accesstoken ni refresh token
  if (!token && !req.signedCookies.refreshToken) {
    console.log('Invalid credentials');
    // return res.status(401).send({ message: 'Invalid credentials' });
    return res.redirect(301, '/signin');
  }

  // cliente se auth e hizo refresh/reload y/o api request
  if (req.signedCookies.refreshToken) {
    verifyRefreshToken(req.signedCookies.refreshToken, req.fingerprint)
      .then((newTokens) => {
        const cookiesOptions = {
          secure: isProd,
          httpOnly: isProd,
          maxAge: 5184000000, // 2m
          path: '/',
          sameSite: true,
          signed: true,
          domain: isProd ? process.env.SERVER_URL : 'localhost',
        };

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
              console.log(err.message);
              return res.status(401).send({ message: err.message });
            });
        } else {
          // no existe access token pero si refreshtoken (refresh/reload)
          return next();
        }
      })
      .catch((err) => {
        console.log(err.message);
        if (req.originalUrl === '/api/users') {
          // si fue llamada a api no puedo devolver redirect, sino el
          // response seria la pagina a la que redirijo
          return res.status(401).send({ message: err.message });
        }
        // aqui como solamente es una ruta como posts puedo redirect
        return res.redirect(301, '/signin');
      });
  }
}
