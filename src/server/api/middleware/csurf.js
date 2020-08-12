import csurf from 'csurf';

export default csurf({
  cookie: {
    key: '_csrf',
    path: '/', // context route
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600, // 1-hour
    sameSite: 'strict',
  },
});
