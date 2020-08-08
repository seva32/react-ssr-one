import express from 'express';

const router = express.Router();

router.get('/', (req, res, _next) => {
  res.send({ seb: 'data from seb' });
});

export default router;
