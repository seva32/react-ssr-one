import dotenv from 'dotenv';
import { RateLimiterMongo } from 'rate-limiter-flexible';
import mongoose from 'mongoose';

dotenv.config({ silent: true });

mongoose.connect(process.env.MONGOOSE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const mongoConn = mongoose.connection;

const opts = {
  storeClient: mongoConn,
  points: process.env.REQUEST_PER_SECOND_LIMIT || 15, // 'n' requests
  duration: 1, // Per second(s)
};

const rateLimiterMongo = new RateLimiterMongo(opts);

const rateLimiterMiddleware = (req, res, next) => {
  rateLimiterMongo
    .consume(req.ip, 2) // consume 2 points
    .then((_rateLimiterRes) => {
      next(); // 2 points consumed
    })
    .catch((_rateLimiterRes) => {
      res.status(429).send('Too Many Requests');
      // Not enough points to consume
    });
};

export default rateLimiterMiddleware;
