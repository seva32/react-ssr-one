import dotenv from 'dotenv';

dotenv.config();

export default {
  secret: process.env.TOKEN_SECRET,
  expiry: 10,
};
