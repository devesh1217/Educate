import userSchema from '../model/user.js'
import nodemailer from 'nodemailer';

const userRoute = {
    otp: async (req, res)=>{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'u22cs035@coed.svnit.ac.in', 
                pass: 'pkjncigmlpcxlurv',       
            },
        });

        let otpDigits = '';
        for(let i=0;i<6;i++){
            otpDigits+= Math.floor(Math.random() * 10);
        }
        const mailOptions = {
            from: 'services@tarangsir.ac.in',
            to: req.body.email,
            subject: 'Your OTP is ' + otpDigits,
            text: 'Your OTP is ' + otpDigits,
            html: 'Your OTP is ' + otpDigits
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(info.response);
            } else {
                res.status(200).json({otp:otpDigits});
            }
        });
    },
    create: async (req, res) => {
        const data = new userSchema(req.body);
        let c = -1;
        await userSchema.countDocuments({})
            .then((doc) => {
                c = doc;
            }).catch((err) => {
                console.log(err)
                res.sendStatus(500);
            });

        


        if (c !== null) {
            data.userId = new Date().getFullYear() + String(c + 1).padStart(4, '0');
            data.password = data.userName.substring(0, 4).toUpperCase() + String(data.registrationDate.getDate()).padStart(2, '0') + String(data.registrationDate.getMonth() + 1).padStart(2, '0');
            await data.save()
                .then((doc) => {
                    res.sendStatus(201);
                }).catch((err) => {
                    console.log(err)
                    res.sendStatus(404);
                });
        }
    },
    login: async (req, res) => {
        const id = req.body.id;
        const pswd = req.body.pswd;
        console.log(id,pswd)
        await userSchema.findOne({ userId: id })
            .then((doc) => {
                if (doc) {
                    if (doc.userId == id && doc.password == pswd) {
                        res.status(200).json({ isValid: true });
                    } else {
                        res.status(200).json({ isValid: false });
                    }
                } else {
                    res.status(200).json({ isValid: false });
                }
            }).catch((err) => {
                res.sendStatus(404);
            });
    },
    payment: async (req, res) => {
        const id = req.body.id || req.params.id;
        await userSchema.updateOne({ userId: id }, { $set: { paymentDone: true } })
            .then((doc) => {
                if (doc)
                    res.status(200).json(doc);
                else
                    res.status(200).json(null);
            }).catch((err) => {
                res.sendStatus(404);
            });
    },
}


export default userRoute;