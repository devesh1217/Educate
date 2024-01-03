import express from 'express';
import user from '../controllers/user.js'

const userRouter = express.Router();

userRouter
    .post('/',user.create)
    .post('/login',user.login)
    .post('/otp',user.otp)
    .get('/payment/:id',user.payment)
export default userRouter;