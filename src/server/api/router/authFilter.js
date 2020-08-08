import express from 'express';

import { cors, csurf as csrfProtection, jwtMiddleware } from '../middleware';

const router = express.Router();

router.use(
  ['/users', '/posts'],
  [cors, csrfProtection, jwtMiddleware],
  (req, res, next) => {
    next();
  },
);

export default router;
