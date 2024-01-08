import express from 'express';
import user from '../controllers/user.js'

const userRouter = express.Router();

userRouter
    .post('/',user.create)
    .get('/admin/pending',user.pending)
    .get('/admin/enrolled',user.enroll)
    .get('/admin/payment/:id',user.payment)
    .get('/get/:id',user.getOne)
    .get('/name/:id',user.getName)
    .post('/login',user.login)
    .post('/otp',user.otp)
export default userRouter;