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
const userModel_1 = require("../model/userModel");
const hashPassword_1 = require("../helper/hashPassword");
const generateJWT_1 = require("../helper/generateJWT");
const courseModel_1 = require("../model/courseModel");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
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
        const newUser = new userModel_1.userModel({
            username: username,
            email: email,
            password: hashedPass,
        });
        const user = yield userModel_1.userModel.create(newUser);
        return res.status(200).json({ msg: "success", user });
    }
    catch (error) {
        console.log(error);
    }
});
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
        const token = yield (0, generateJWT_1.generateJWT)({ id: user._id, email: user.email });
        return res.status(200).json({ msg: "success", user, token });
    }
    catch (error) {
        console.log(error);
    }
});
const getCategoryCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.query;
    if (!category || category == undefined) {
        return res.status(400).json({ msg: "Please provide category" });
    }
    if (category != 'backend' || 'frontend' || 'ui/ux' || 'other' || 'qa' || 'devops') {
        return res.status(400).json({ msg: "Please fill only right category" });
    }
    try {
        const course = yield courseModel_1.courseModel.find({ courseCategory: category });
        return res.status(200).json({ msg: "success", course });
    }
    catch (error) {
        console.log(error);
    }
});
const getPopularCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield courseModel_1.courseModel.find({});
        return res.status(200).json({ msg: "Success", course });
    }
    catch (error) {
        console.log(error);
    }
});
const getCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.user.userId;
    try {
        const user = yield userModel_1.userModel.findOne({ _id: userId });
        if (!user) {
            return res.status(401).json({ msg: "token invalid please login again" });
        }
        const course = yield courseModel_1.courseModel.findOne({ _id: id });
        if ((course === null || course === void 0 ? void 0 : course._id) !== undefined) {
            yield user.myCourse.push({ courseId: course === null || course === void 0 ? void 0 : course._id });
            yield user.save();
            return res.status(200).json({ msg: "success", course, user });
        }
    }
    catch (error) {
        console.log(error);
    }
});
const getDetailCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: courseId } = req.params;
    const userId = req.user.userId;
    try {
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
const searchCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, sort } = req.query;
    const regex = new RegExp(name, "i");
    try {
        if (name) {
            const course = yield courseModel_1.courseModel.find({ name: { $regex: { regex, $options: "i" } } });
            return res.status(200).json({ msg: "success", course });
        }
        if (name && sort === 'asc') {
            const course = yield courseModel_1.courseModel.find({ name: { $regex: { regex, $options: "i" } } }).sort({ price: 1 });
            return res.status(200).json({ msg: "success", course });
        }
        if (name && sort === 'desc') {
            const course = yield courseModel_1.courseModel.find({ name: { $regex: { regex, $options: "i" } } }).sort({ price: -1 });
            return res.status(200).json({ msg: "success", course });
        }
        if (name && sort === 'free') {
            const course = yield courseModel_1.courseModel.find({ name: { $regex: { regex, $options: "i" } } }).where({ isFree: true });
            return res.status(200).json({ msg: "success", course });
        }
        return res.status(400).json({ msg: "please provide correct query" });
    }
    catch (error) {
        console.log(error);
    }
});
