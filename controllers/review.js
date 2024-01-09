import 'fs';
import reviewSchema from '../model/review.js'

const reviewRoute = {
    get: async (req, res) => {
        await reviewSchema.find({})
            .then((doc) => {
                res.status(200).json(doc);
            }).catch((err) => {
                console.log(err)
                res.sendStatus(500);
            });

    },
    create: async (req, res) => {
        const data = new reviewSchema(req.body);

        data.save()
        .then(()=>{
            res.sendStatus(201)
        }).catch((err)=>{
            console.log(err)
            res.sendStatus(500);
        })
    },
}


export default reviewRoute;