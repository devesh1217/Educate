import express from 'express';
import review from '../controllers/review.js'

const reviewRouter = express.Router();

reviewRouter
    .post('/',review.create)
    .get('/get/',review.get)

export default reviewRouter;