import express from 'express';
import data from '../controllers/data.js'

const dataRouter = express.Router();

dataRouter
    .get('/:id',data.get)
    .get('/get/:id',data.getLec)
    .post('/testAns/:id',data.testAns)

export default dataRouter;