"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCourse = exports.getDetailCourse = exports.getCourse = exports.getPopularCategory = exports.getCategoryCourse = exports.loginUser = exports.registerUser = void 0;
const userModel_1 = require("../model/userModel");
const hashPassword_1 = require("../helper/hashPassword");
const generateJWT_1 = require("../helper/generateJWT");
const courseModel_1 = require("../model/courseModel");
const comparePass_1 = require("../helper/comparePass");
const cloudinary_1 = require("cloudinary");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    let file = req.file;
    if (!username) {
        return res.status(400).json({ msg: "Please provide username" });
    }
    if (!email) {
        return res.status(400).json({ msg: "Please provide email" });
    }
    try {
        const checkUser = yield userModel_1.userModel.findOne({ email: email });
        if (checkUser) {
            return res.status(400).json({ msg: "email already registered" });
        }
        const hashedPass = yield (0, hashPassword_1.hashPassword)(password);
        if (!file) {
            const newUser = new userModel_1.userModel({
                username: username,
                email: email,
                password: hashedPass,
                avatar: ""
            });
            const user = yield userModel_1.userModel.create(newUser);
            return res.status(200).json({ msg: "success", user });
        }
        const image = yield cloudinary_1.v2.uploader.upload(file.path, {
            folder: 'Testing',
            resource_type: 'auto'
        });
        const newUser = new userModel_1.userModel({
            username: username,
            email: email,
            password: hashedPass,
            avatar: image.secure_url
        });
        const user = yield userModel_1.userModel.create(newUser);
        return res.status(200).json({ msg: "success", user });
    }
    catch (error) {
        console.log(error);
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400).json({ msg: 'Please fill email' });
    }
    try {
        const user = yield userModel_1.userModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ msg: "Email not registered yet" });
        }
        const isPassCorrect = yield (0, comparePass_1.comparePass)({ userInputPass: password, encryptedPass: user.password });
        if (!isPassCorrect) {
            return res.status(401).json({ msg: "Password wrong" });
        }
        const token = (0, generateJWT_1.generateJWT)({ id: user._id, email: user.email });
        return res.status(200).json({ msg: "success", user, token });
    }
    catch (error) {
        console.log(error);
    }
});
exports.loginUser = loginUser;
const getCategoryCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.query;
    if (!category || category == undefined) {
        return res.status(400).json({ msg: "Please provide category query" });
    }
    try {
        const course = yield courseModel_1.courseModel.find({ courseCategory: category });
        return res.status(200).json({ msg: "success", course });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getCategoryCourse = getCategoryCourse;
const getPopularCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield courseModel_1.courseModel.aggregate([
            {
                $project: {
                    _id: 1,
                    name: 1,
                    totalSoldCount: {
                        $cond: { if: { $isArray: "$totalSold" }, then: { $size: "$totalSold" }, else: 0 }
                    }
                }
            },
            {
                $sort: { totalSoldCount: -1 }
            },
            {
                $limit: 5
            }
        ]);
        const populatedCourses = yield courseModel_1.courseModel.populate(course, { path: "_id" });
        return res.status(200).json({ msg: "success", populatedCourses });
    }
    catch (error) {
        console.error("Error:", error);
    }
});
exports.getPopularCategory = getPopularCategory;
const getCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.user.userId;
    try {
        const user = yield userModel_1.userModel.findOne({ _id: userId });
        if (!user) {
            return res.status(401).json({ msg: "token invalid please login again" });
        }
        const course = yield courseModel_1.courseModel.findOne({ _id: id });
        const userCheck = user.myCourse.findIndex((item) => item.courseId.equals(course === null || course === void 0 ? void 0 : course._id));
        if (userCheck !== -1) {
            return res.status(400).json({ msg: "You only can buy once" });
        }
        if ((course === null || course === void 0 ? void 0 : course._id) !== undefined) {
            user.myCourse.push({ courseId: course === null || course === void 0 ? void 0 : course._id });
            course.totalSold.push({ userId: user._id });
            yield user.save();
            yield course.save();
            return res.status(200).json({ msg: "success", course, user });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.getCourse = getCourse;
const getDetailCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: courseId } = req.params;
    const userId = req.user.userId;
    try {
        const user = yield userModel_1.userModel.findOne({ _id: userId });
        if (!user) {
            return res.status(401).json({ msg: "Token invalid" });
        }
        const course = yield courseModel_1.courseModel.findOne({ _id: courseId });
        if (!course) {
            return res.status(404).json({ msg: "course not found" });
        }
        return res.status(200).json({ msg: "success", course });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getDetailCourse = getDetailCourse;
const searchCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price } = req.query;
    try {
        if (name) {
            const regex = new RegExp(name, 'i');
            let query = courseModel_1.courseModel.find({ name: { $regex: regex } });
            if (price === 'asc') {
                query.sort({ price: 1 });
            }
            if (price === 'desc') {
                query.sort({ price: -1 });
            }
            if (price === 'free') {
                query.where({ isFree: true });
            }
            const courses = yield query.exec();
            return res.status(200).json({ msg: 'success', courses });
        }
        else {
            return res.status(400).json({ msg: 'Please provide a search term' });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
});
exports.searchCourse = searchCourse;
