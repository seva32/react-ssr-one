import cors from 'cors';

const corsOptions = {
  origin: [process.env.SERVER_URL, 'localhost'],
  methods: 'GET,HEAD,POST,PATCH,DELETE,OPTIONS',
  credentials: true, // required to pass allowedHeaders
  allowedHeaders: [
    'X-Access-Token',
    'X-Requested-With',
    'X-HTTP-Method-Override',
    'Content-Type',
    'Accept',
    'Authorization',
    'refreshToken',
    'seva',
    'CSRF-Token',
  ],
  exposedHeaders: ['refreshToken', 'X-Access-Token', 'seva', 'CSRF-Token'],
};

export default cors(corsOptions);
