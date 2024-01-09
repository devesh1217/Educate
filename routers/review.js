import express from 'express';
import review from '../controllers/review.js'

const reviewRouter = express.Router();

dataRouter
    .get('/:id',review.get)
    .get('/get/:id',review.getLec)

export default reviewRouter;