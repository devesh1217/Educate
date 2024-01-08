import { google } from "googleapis";
import 'fs';
import nodemailer from 'nodemailer';
import credentials from '../apiKeys.json' with { type: "json" };
import userSchema from '../model/user.js'

const { private_key, client_email, client_id, auth_uri, token_uri } = credentials;

const auth = new google.auth.GoogleAuth({
    credentials: {
        private_key,
        client_email,
        client_id,
        auth_uri,
        token_uri
    },
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});
const drive = google.drive({ version: 'v3', auth });
const jwtClient = new google.auth.JWT(
    client_email,
    null,
    private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);


async function listFilesInFolder(folderId) {
    try {
        const res = await drive.files.list({
            q: `'${folderId}' in parents`,
            fields: 'files(id, name, mimeType, webViewLink)',
        });

        const files = res.data.files;
        return files;
    } catch (err) {
        console.error('The API returned an error:', err.message);
    }
}

async function getGoogleSheetValues(id) {
    try {
        // ID of your Google Sheet (extract it from the URL)
        const spreadsheetId = id;

        const sheets = google.sheets({ version: 'v4', auth: jwtClient });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Sheet1!A1:A75',
        });

        const values = response.data.values.map((curr)=>curr[0]);

        return values;
    } catch (error) {
        console.error('Error accessing Google Sheet:', error.message);
    }
}

const dataRoute = {
    get: async (req, res) => {
        const folderId = req.params.id;
        await listFilesInFolder(folderId)
            .then((doc) => {
                res.status(200).json(doc);
            }).catch((err) => {
                console.log(err)
                res.sendStatus(500);
            });

    },
    getTestData: async (req, res) => {
        const id = req.body.id;
        const folderId = req.params.id;
        let appearedTest,testData;
        try{
            appearedTest = await userSchema.findOne({ userId: id },{testData:1});
            testData = await listFilesInFolder(folderId);
        } catch(err){
            console.log(err)
        }
        let ans=[];
        if(appearedTest){
            for(let i=0;i<testData.length;i++){
                let f=true;
                for(let j=0;j<appearedTest.testData;j++){
                    if(appearedTest.testData[j].id==testData[i].id){
                        f=false;
                        break;
                    }
                }
                if(f){
                    ans.push(testData[i]);
                }
            }
            console.log(ans)
            res.status(200).json(ans);
        }else {
            res.status(200).json(testData);
        }
    },
    getResult: async (req, res) => {
        const id = req.body.id;
        let appearedTest;
        try{
            appearedTest = await userSchema.findOne({ userId: id },{testData:1});
        } catch(err){
            console.log(err)
        }   
        res.json(appearedTest.testData)
    },
    getLec: async (req, res) => {
        const folderId = req.params.id;
        await listFilesInFolder(folderId)
            .then((doc) => {
                const ans = {}
                doc.forEach((curr, indx) => {
                    let topicName = curr.name.split('.')[0];
                    if (ans[topicName]) {
                        if (ans[topicName].pdf) {
                            ans[topicName].video = curr.webViewLink
                        } else {
                            ans[topicName].pdf = curr.webViewLink
                        }
                    } else {
                        if (curr.mimeType.split('/')[0] == 'application') {
                            ans[topicName] = {
                                name: topicName,
                                pdf: curr.webViewLink
                            }
                        } else {
                            ans[topicName] = {
                                name: topicName,
                                video: curr.webViewLink
                            }
                        }
                    }
                })
                res.status(200).json(ans);
            }).catch((err) => {
                console.log(err)
                res.sendStatus(500);
            });

    },
    
    testAns: async (req, res) => {
        const ansKey = await getGoogleSheetValues(req.params.id);
        const ans = req.body.ans;
        const id = req.body.id;
        const correct = [];
        const notMarked = [];
        const inCorrect = [];
        let phy = 0, chem = 0, maths = 0;
        let acc=0;
        let userData;

        await userSchema.findOne({ userId: id })
            .then((doc) => {
                if (doc)
                    userData = (doc);
            }).catch((err) => {
                console.log(err)
                res.sendStatus(500);
            });

        ans.forEach((curr, indx) => {

            if (curr == '') {

                notMarked.push(indx);
            } else if (curr === ansKey[indx]) {
                if (indx < 25) {
                    phy += 4;
                } else if (indx < 50) {
                    chem += 4;
                } else {
                    maths += 4;
                }

                correct.push(indx);
            } else {
                if (indx < 25) {
                    phy -= 1;
                } else if (indx < 50) {
                    chem -= 1;
                } else {
                    maths -= 1;
                }
                inCorrect.push(indx);
            }
        });


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'u22cs035@coed.svnit.ac.in', // Replace with your Gmail email
                pass: 'pkjncigmlpcxlurv',       // Replace with your Gmail password or use an server password
            },
        });
        acc=100*(correct.length)/((correct.length)+(inCorrect.length));
        const mailOptions = {
            from: 'results.tarangsir@class.in',
            to: 'u22cs067@coed.svnit.ac.in',
            subject: 'Test Result of date ' + new Date().toLocaleDateString(),
            text: 'Test Result of date ' + new Date().toLocaleDateString(),
            html: `<div class="result-box" style="font-family:Verdana, Geneva, Tahoma, sans-serif">
            <div style="text-align: center; font-size: 2rem; background-color: rgb(25, 62, 156); color: white; ">
                Test Result
            </div>
            <div style="font-size: 1.2rem; margin-top: 2rem; margin-bottom: 2rem; ">
                <div>Name:</div>
                <div>st name : </div>
                <div>Date : </div>
            </div>
            <hr>
            <div style="font-size: 1.2rem; margin-top: 2rem; margin-bottom: 2rem; "> 
                <div style="margin-bottom: 0.7rem;">Total Marks : ${(correct.length) * 4 - (inCorrect.length)}</div>
                <div style="margin-bottom: 0.7rem;">Total Correct : ${(correct.length)}</div>
                <div style="margin-bottom: 0.7rem;">Total Incorrect : ${(inCorrect.length)}</div>
                <div style="margin-bottom: 0.7rem;">Total Not Attempted : ${notMarked.length}</div>
                <div style="margin-bottom: 0.7rem;">Accuracy : ${(acc)?acc:0}</div>
            </div>
            <hr>
            <div style="font-size: 1.2rem; margin-top: 2rem;margin-bottom: 2rem; "> 
                <div style="margin-bottom: 0.7rem;">Physics : ${phy}</div>
                <div style="margin-bottom: 0.7rem;">Chemistry : ${chem}</div>
                <div style="margin-bottom: 0.7rem;">Maths : ${maths}</div>
            </div>
            <hr>
            <div>
            From Tarang Sir
            </div>
            <hr>
            <div style="text-align: center; font-size: 0.9rem; background-color: rgb(25, 62, 156); color: gray; padding 5px">
                If you have any doubt then please contact Tarang Sir.
            </div>
        </div>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        const update = await userSchema.updateOne(
            { userId: id },
            { 
                $push: { 
                    testData: { 
                        id: req.params.id,
                        correct: correct,
                        inCorrect: inCorrect,
                        notMarked: notMarked,
                        phy,
                        chem,
                        maths,
                        acc:100*(correct.length)/((correct.length)+(inCorrect.length)),
                        date: new Date()
                    }
                }
            }
        );


        res.json({
            correct,
            inCorrect,
            notMarked,
            phy,
            chem,
            maths,
            acc:100*(correct.length)/((correct.length)+(inCorrect.length))
        });
    },

}


export default dataRoute;