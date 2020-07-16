import passport from 'passport';
import { signup, signin } from './contollers/authentications';
import passportConfig from './passport'; // eslint-disable-line

// uso local strategy porque me llega email y pass
const requireSignin = passport.authenticate('local', {
  session: false,
  failureRedirect: '/signin',
});

export default (app) => {
  app.post('/api/signup', signup);
  app.post('/api/signin', requireSignin, signin);
};
