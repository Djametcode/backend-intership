import mongoose, { Types } from "mongoose";
const { Schema } = mongoose

interface ISold {
    userId: Types.ObjectId;
    review: string;
    rating: number
}

interface ICourse {
    name: string;
    price: number;
    isFree: boolean;
    description: string;
    courseImage: string[];
    owner: Types.ObjectId
    courseCategory: "backend" | "frontend" | "ui/ux" | "other" | "devops" | "qa";
    totalSold: ISold[]
}

const courseSchema = new Schema<ICourse>({
    name: {
        type: String,
        required: [true, "Please provide course name"]
    },
    price: {
        type: Number,
        required: [true, "Please provide course price"]
    },
    isFree: {
        type: Boolean,
        required: [true, "Please provide free status"],
        default: false
    },
    description: {
        type: String,
        required: [true, "Please provide description"]
    },
    courseImage: [],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    courseCategory: {
        type: String,
        enum: ["backend", "frontend", "qa", "devops", "ui/ux", "other"]
    },
    totalSold: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        review: {
            type: String,
        },
        rating: {
            type: Number,
            max: 5,
            min: 1
        }
    }]
})

export const courseModel = mongoose.model("Course", courseSchema)