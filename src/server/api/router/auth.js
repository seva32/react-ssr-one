import express from 'express';

import { cors, csurf as csrfProtection } from '../middleware';
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
  [checkDuplicateEmail, checkRolesExisted, csrfProtection],
  signup,
);
router.post('/signin', [cors, csrfProtection], signin);
router.post('/signout', [cors, csrfProtection], signout);
router.post('/refresh-token', [cors, csrfProtection], refreshTokenController);
router.post('/reset-password', [cors, csrfProtection], resetPassword);
router.post('/change-password', [cors, csrfProtection], changePassword);

export default router;
