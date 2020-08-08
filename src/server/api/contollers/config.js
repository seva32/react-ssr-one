import dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

export const cookiesOptions = {
  secure: isProd,
  httpOnly: isProd,
  maxAge: 5184000000, // 2m
  path: '/',
  sameSite: 'lax',
  domain: isProd ? process.env.SERVER_URL : 'localhost',
};

export default {
  secret: process.env.TOKEN_SECRET,
  expiryToken: isProd ? 5 : 14, // only in seconds!!!
  expiryRefreshToken: isProd ? 10 : 60, // seconds or not '15d'
};
