import mongoose, { Types } from "mongoose";
const { Schema } = mongoose

interface ICourse {
    courseId: Types.ObjectId
}

interface IAdmin {
    username: string;
    email: string;
    password: string;
    avatar: string;
    createdCourse: ICourse[]
}

const adminSchema = new Schema<IAdmin>({
    username: {
        type: String,
        required: [true, "Please provide username"]
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
    },
    password: {
        type: String,
        required: [true, "Please provide password"]
    },
    avatar: {
        type: String,
        default: ""
    },
    createdCourse: [{
        courseId: {
            type: Schema.Types.ObjectId,
            ref: "Course"
        }
    }]
})

export const adminModel = mongoose.model<IAdmin>("Admin", adminSchema)