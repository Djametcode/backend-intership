import mongoose from "mongoose";
const { Schema } = mongoose

interface IAdmin {
    username: string,
    email: string,
    password: string,
    avatar: string
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
    }
})

export const adminModel = mongoose.model<IAdmin>("Admin", adminSchema)