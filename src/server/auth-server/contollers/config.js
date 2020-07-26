import dotenv from 'dotenv';

dotenv.config();

export default {
  secret: process.env.TOKEN_SECRET,
  expiryToken: 10,
  expiryRefreshToken: 60, // '30d'
};
