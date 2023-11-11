import mongoose, { Types } from "mongoose";
const { Schema } = mongoose

interface ICourse {
    courseId: Types.ObjectId
}

interface IUser {
    username: string;
    email: string;
    password: string;
    avatar: string;
    myCourse: ICourse[]
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, "Please provide username"]
    },
    email: {
        type: String,
        required: [true, "Please provide email"]
    },
    password: {
        type: String,
        required: [true, "Please provide password"]
    },
    avatar: {
        type: String,
        default: ""
    },
    myCourse: [{
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course'
        }
    }]
})

export const userModel = mongoose.model<IUser>('User', userSchema)