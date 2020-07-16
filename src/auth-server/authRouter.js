import passport from 'passport';
import { signup, signin } from './contollers/authentications';
import passportConfig from './passport'; // eslint-disable-line

// uso local strategy porque me llega email y pass
const requireSignin = passport.authenticate('local', {
  session: false,
  failureRedirect: '/signin',
});

const logger = (req, res, next) => {
  console.log('*******************************', req.params);
  next();
};

export default (app) => {
  app.use('/', logger);
  app.get('/api/auth', (req, res, _next) => {
    if (req.session.auth === 'true') {
      res.redirect(301, 'https://www.google.com');
    } else {
      res.redirect(301, 'https://www.yahoo.com');
    }
  });
  app.post('/api/signup', logger, signup);
  app.post('/api/signin', logger, requireSignin, signin);
};
