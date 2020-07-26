/* eslint-disable consistent-return */
// the middleware attach the actual user to req
import { verifyJWTToken } from '../jwt/jwt';

// eslint-disable-next-line import/prefer-default-export
export function jwtMiddleware(req, res, next) {
  const token = req.get('x-access-token');
  if (!token) {
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
