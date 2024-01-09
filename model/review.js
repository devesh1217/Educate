import mongoose from "mongoose";
import { Schema } from "mongoose";
import 'bcryptjs';

const schema = new mongoose.Schema({
    date: {
        type: Date,
        default: new Date(),
    },
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        require: true
    },
    rating:{
        type: Number,
        require: true
    }
});

const review = mongoose.model('review', schema);


export default review;