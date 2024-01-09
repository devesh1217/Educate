import { google } from "googleapis";
import 'fs';
import nodemailer from 'nodemailer';
import userSchema from '../model/user.js'

const  private_key="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCndwfV2agikiCC\nLaxjUvjqtwp/pA3zQuz2cKrKxBGBV4eNzLaXtujCGuHcaZCy3CAww71QF5aB2OQ0\nl3DkNHg+UQDfs5agi4PNbfgHjD54+8a3X7rSls8qntB6FiJIjSs5gLOelcpiWiVM\nZVcrJq5/Z+BluAs3JD4ijvrNq6Vm67ImWTJ0WKk5aYsXzFtVapxYGrYtkRV7EvY1\nWp6MUIugxyAbIlgdcmz58Yqt+OQdKlX2nUe688Pc/k08k4G4aF7rlndC9rpwdFF2\n7C5XxyozZhm+d9nkToZwEKA0rmCJkBKNvVBqovJMY4VMsd/ZxIU77XxWDLhcBxRF\nt8Wu35rbAgMBAAECggEAAQNXZupBgSkZsfo3nx5rXZPy+m6Jqk+QCK1k+6MCVrkA\nIVvm1nigbOE+MijvgH9EmgGVqPZXenbVFM0e1vFTmoiMIphBvJn7Gm+DkXQe7MLQ\nh/vfuVmKAGxvl3echYxkGHiiUigbINbldDi8DZqViLJrAVn9JYNkpcQMqQwYvWus\nEUpXRw/5O36QhIsn3BZ7ElVXL1Xpyfy/etYxz8zRgVZmOJFyCGnUcBM/PyfENF54\n6Yb9BNxfQct2D//AwfEPZPff3HtaGIDmvkQtoNpXNeN+ba2sHVWfy2m9m8DmBd/b\n+g1rDsTb9zzcSb2n4xUwbAMi3TicxWf+xbVP/M4x1QKBgQDpngDnWtzLzfqYDL6b\nCXDSGXdkyFEGR6m4lVlzDk9SUgGAwk+hemTz626O5JiWuTMvxSD9qr6M2y7QMWq3\nvYqUukwQTKVnu+6E+TPXbKxyybPSwM16HW6aCv8IDvuGZnW7+9ZAzqJoPhALKU35\nBiMheYFjq19Ugk7D+X0zkdi5rQKBgQC3gn33f3mQsVaejlbEDLvDKUy8g75s872W\nBu15Cig+We7PeWkjIzlKoESdPK+6/y7k7r8G7Tyt65JSuWpSZyZPTsUe2VLLRMdf\nurhBwvtk1bc1quXZgWCN0Mf0LkSVzvoP4nES6wNfU1KKxoV/P+A+fG542XMsJgXi\nyc2Gge3HpwKBgQCDbsBlaQpFoyn0N19ZDDOsEGXKjqR/GvxSe7vqbkeUMczkqu1w\nFNMNJAx8WgG68pDotEg+TryLtJieyt6WZw27ZSB8HxMDzIiByU4wSdSvc+k2jgBM\nTpi2E6+t0fgSgjyEuUeuCFL4wMn37ZIPozNKlviDoZutiO5VdVzKEajTtQKBgCQD\nyjEOpY8OHs/TY5fqX9c3fcXpnS/IzkZpaaW9ppRGFiZFz6qDuTS6K30ocdyjRFLN\nwFPdr3D6sKbnmMQ/VjduYCVjxWn7P528CXluiOQLRX+U4LNFPuvWM8fqZK96BX2k\nlUh/MxQ8SBDQUVbd9GaPCSdSldXuSG1v6ZQiX8Y1AoGAJP71sztHCXTj3p7UBIcb\nuFb+Y6ETeJeO2KSzRScm2nsQkAwE0jHTxCYv5mxyhrbtZ/2HtHAsoX24VaHxtVma\nYOS7/K8v5EtlGMHcdsRnwflH9rDaZIGq9YdhACivle+mVLWswfQJO9St0O98YkEG\n/fDJYhSzBR8Okzz5tz0Izik=\n-----END PRIVATE KEY-----\n";
const client_email="gwoc-test@gwoc-409815.iam.gserviceaccount.com";
const client_id="113328304135101276873";
const auth_uri="https://accounts.google.com/o/oauth2/auth";
const token_uri="https://oauth2.googleapis.com/token" ;

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
                for(let j=0;j<appearedTest.testData.length;j++){
                    if(appearedTest.testData[j].testId==testData[i].id){
                        f=false;
                        break;
                    }
                }
                if(f){
                    ans.push(testData[i]);
                }
            }
            res.status(200).json(ans);
        }else {
            res.status(200).json(testData);
        }
    },
    getResult: async (req, res) => {
        const id = req.params.id;
        let appearedTest;
        try{
            appearedTest = await userSchema.findOne({ userId: id },{_id:0,userId:1,userName:1,email:1,mobile:1,testData:1});
            if(appearedTest)
                res.status(200).json(appearedTest);
            else
                res.status(200).json({});
        } catch(err){
            console.log(err)
            res.sendStatus(500);
        }   
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
        const testId = req.body.testId;
        const testName = req.body.testName;
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
            to: userData.email,
            subject: 'Test Result of date ' +testName+" ("+ new Date().toLocaleDateString()+")",
            text: 'Test Result of date ' +testName+" ("+ new Date().toLocaleDateString()+")",
            html: `<div class="result-box" style="font-family:Verdana, Geneva, Tahoma, sans-serif">
            <div style="text-align: center; font-size: 2rem; background-color: rgb(25, 62, 156); color: white; ">
                Test Result
            </div>
            <div style="font-size: 1.2rem; margin-top: 2rem; margin-bottom: 2rem; ">
                <div>Test : ${testName}</div>
                <div>st name : ${userData.userName}</div>
                <div>Date : ${new Date().toLocaleString()}</div>
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
                        testId,
                        testName,
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