/* eslint-disable consistent-return */
import { verifyJWTToken } from '../irina/jwt';

// eslint-disable-next-line import/prefer-default-export
export function jwtMiddleware(req, res, next) {
  // get token from headers object
  const token = req.get('x-access-token');
  // check token
  if (!token) {
    return res.status(401).send('Invalid credentials');
  }

  verifyJWTToken(token)
    .then((userId) => {
      // put user's information to req object
      req.user = { userId };
      // call next to finish this middleware function
      next();
    })
    .catch((err) => {
      res.status(401).send(err);
    });
}
