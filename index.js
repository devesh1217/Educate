import 'fs';
import express from 'express';
import cors from 'cors';

import mongoose from 'mongoose';
import userRouter from "./routers/user.js";
import dataRouter from "./routers/data.js";

const server = express();
const port = 8080;


const main = async () => {
    await mongoose.connect('mongodb+srv://u22cs035:abcd@cluster0.ffngqxj.mongodb.net/users?retryWrites=true&w=majority');
}

main()
    .then(() => { console.log('DB Connected') })
    .catch((err) => { console.log('Error occuered!', err) });


server.use(cors());
server.use(express.json());
server.use(express.static('public'));
server.use('/user', userRouter);
server.use('/data', dataRouter);



// Function to list files in a specific folder




server.get('/api', async (req, res) => {
    const folderId = '1ZoSD9YViVQQNWIGZD0FPXK-C5ywgnlQM';

    const files = await listFilesInFolder(folderId);

    if (files.length) {
        res.json(files);
    } else {
        res.json({ message: 'No files found in the folder.' });
    }
});

server.get('/data/:id', async (req, res) => {
    const folderId = req.params.id;

    try {
        const files = await listFilesInFolder(folderId);
        res.json(files);
    } catch (err) {
        console.log(err)
        res.sendStatus(500);
    }
});

server.post('/test', async (req, res) => {
    const ansKey = await getGoogleSheetValues('1sh0LFSBxBRZS7IPLSwOK5FRlrddXXH8_iz51kxf38UM');
    const ans = req.body.ans;
    const correct = [];
    const notMarked = [];
    const inCorrect = [];
    const to = 'u22cs057@coed.svnit.ac.in';
    const sub = 'Test Result'


    ans.forEach((curr, indx) => {
        if (curr == '') {
            notMarked.push(indx);
        } else if (curr === ansKey[indx]) {
            correct.push(indx);
        } else {
            inCorrect.push(indx);
        }
    });
    const body = 'Correct: ' + correct.length + '<br>Incorrect: ' + inCorrect.length + '<br>Not marked: ' + notMarked.length;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'u22cs035@coed.svnit.ac.in', // Replace with your Gmail email
            pass: 'pkjncigmlpcxlurv',       // Replace with your Gmail password or use an server password
        },
    });

    const mailOptions = {
        from: 'u22cs035@coed.svnit.ac.in',
        to: to,
        subject: sub,
        text: body,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

    res.json({
        correct,
        inCorrect,
        notMarked
    });
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});