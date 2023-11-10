"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const courseSchema = new Schema({
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
});
exports.courseModel = mongoose_1.default.model("Course", courseSchema);
