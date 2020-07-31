import dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

export default {
  secret: process.env.TOKEN_SECRET,
  expiryToken: isProd ? 60 : 14,
  expiryRefreshToken: isProd ? '15d' : 60,
};
