"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const userSchema = new Schema({
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
    myCourse: [{
            courseId: {
                type: Schema.Types.ObjectId,
                ref: 'Course'
            }
        }]
});
exports.userModel = mongoose_1.default.model('User', userSchema);
