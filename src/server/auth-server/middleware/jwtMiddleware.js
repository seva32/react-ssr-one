/* eslint-disable consistent-return */
// the middleware attach the actual user to req
import { verifyJWTToken } from '../jwt/jwt';

// eslint-disable-next-line import/prefer-default-export
export function jwtMiddleware(req, res, next) {
  console.log('token:::::::', req.accessToken);
  const token = req.get('x-access-token');
  if (!token) {
    // cuando el cliente hace un reload/refresh en ruta con auth
    // va a tener un token refresh si fue auth previamente
    if (req.cookies.refreshToken) {
      const cookiesOptions = {
        secure: false,
        httpOnly: false,
        domain: 'localhost',
      };
      res.cookie('protectedPath', req.originalUrl, cookiesOptions);
      return res.redirect(301, '/refresh-token');
    }
    return res.status(401).send('Invalid credentials');
  }

  verifyJWTToken(token)
    .then((userId) => {
      req.user = { userId };
      next();
    })
    .catch((err) => {
      res.status(401).send(err);
    });
}
