import express from 'express';

import { cors, csurf as csrfProtection, expressValidator } from '../middleware';
import {
  checkDuplicateEmail,
  checkRolesExisted,
} from '../middleware/verifySignUp';
import {
  signin,
  signup,
  signout,
  refreshTokenController,
  resetPassword,
  changePassword,
} from '../contollers/authController';

const router = express.Router();

router.post(
  '/signup',
  [
    expressValidator.authValidationRules(),
    expressValidator.validate,
    checkDuplicateEmail,
    checkRolesExisted,
    csrfProtection,
  ],
  signup,
);
router.post(
  '/signin',
  [
    expressValidator.authValidationRules(),
    expressValidator.validate,
    cors,
    csrfProtection,
  ],
  signin,
);
router.post('/signout', [cors, csrfProtection], signout);
router.post('/refresh-token', [cors, csrfProtection], refreshTokenController);
router.post(
  '/reset-password',
  [
    expressValidator.authValidationRules(),
    expressValidator.validate,
    cors,
    csrfProtection,
  ],
  resetPassword,
);
router.post(
  '/change-password',
  [
    expressValidator.authValidationRules(),
    expressValidator.validate,
    cors,
    csrfProtection,
  ],
  changePassword,
);

export default router;
