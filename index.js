import 'fs';
import express from 'express';
import cors from 'cors';

import mongoose from 'mongoose';
import userRouter from "./routers/user.js";
import dataRouter from "./routers/data.js";

const server = express();
const port = 8080;


const main = async () => {
    // await mongoose.connect('mongodb+srv://u22cs035:abcd@cluster0.ffngqxj.mongodb.net/users?retryWrites=true&w=majority');
    await mongoose.connect('mongodb://localhost:27017/gwoc');
}

main()
    .then(() => { console.log('DB Connected') })
    .catch((err) => { console.log('Error occuered!', err) });


server.use(cors());
server.use(express.json());
server.use(express.static('public'));
server.use('/user', userRouter);
server.use('/data', dataRouter);



server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

export default server;