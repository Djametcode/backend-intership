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
exports.loginAdmin = exports.getSimpleStatistic = exports.deleteUser = exports.registerAdmin = exports.updateCourse = exports.getAllCourse = exports.createCourse = void 0;
const courseModel_1 = require("../model/courseModel");
const adminModel_1 = require("../model/adminModel");
const hashPassword_1 = require("../helper/hashPassword");
const userModel_1 = require("../model/userModel");
const comparePass_1 = require("../helper/comparePass");
const generateJWT_1 = require("../helper/generateJWT");
const cloudinary_1 = require("cloudinary");
const registerAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    if (!username) {
        return res.status(400).json({ msg: "Please fill username" });
    }
    if (!email) {
        return res.status(400).json({ msg: "Please fill email" });
    }
    try {
        const hashedPass = yield (0, hashPassword_1.hashPassword)(password);
        const newAdmin = new adminModel_1.adminModel({
            username: username,
            email: email,
            password: hashedPass
        });
        const admin = yield adminModel_1.adminModel.create(newAdmin);
        return res.status(200).json({ msg: "Success regist admin", admin });
    }
    catch (error) {
        console.log(error);
    }
});
exports.registerAdmin = registerAdmin;
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400).json({ msg: "Please fill email" });
    }
    try {
        const admin = yield adminModel_1.adminModel.findOne({ email: email });
        console.log(admin === null || admin === void 0 ? void 0 : admin.password);
        if (!admin) {
            return res.status(401).json({ msg: "Email not registered yet" });
        }
        const isPassCorrect = yield (0, comparePass_1.comparePass)({ userInputPass: password, encryptedPass: admin === null || admin === void 0 ? void 0 : admin.password });
        console.log(isPassCorrect);
        if (!isPassCorrect) {
            return res.status(401).json({ msg: "Password wrong" });
        }
        const token = yield (0, generateJWT_1.generateJWT)({ id: admin === null || admin === void 0 ? void 0 : admin._id, email: admin === null || admin === void 0 ? void 0 : admin.email });
        return res.status(200).json({ msg: "success", admin, token });
    }
    catch (error) {
        console.log(error);
    }
});
exports.loginAdmin = loginAdmin;
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, price, description, category } = req.body;
    const userId = req.user.userId;
    let file = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    if (!file) {
        return res.status(400).json({ msg: "Please attach file to fill course image" });
    }
    try {
        const admin = yield adminModel_1.adminModel.findOne({ _id: userId });
        if (!admin) {
            return res.status(401).json({ msg: "Only admin can create course" });
        }
        const image = yield cloudinary_1.v2.uploader.upload(file, {
            folder: 'Testing',
            resource_type: 'auto',
        });
        const newCourse = new courseModel_1.courseModel({
            name: name,
            price: price,
            description: description,
            owner: userId,
            courseImage: [image.secure_url],
            courseCategory: category
        });
        const course = yield courseModel_1.courseModel.create(newCourse);
        return res.status(200).json({ msg: 'Success', course });
    }
    catch (error) {
        console.log(error);
    }
});
exports.createCourse = createCourse;
const getAllCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield courseModel_1.courseModel.find({});
        return res.status(200).json({ msg: 'Success', course });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAllCourse = getAllCourse;
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.user.userId;
    const { name, price, description } = req.body;
    if (!name) {
        return res.status(400).json({ msg: 'Please fill name update for course' });
    }
    if (!price) {
        return res.status(400).json({ msg: "Please fill price update for course" });
    }
    if (!description) {
        return res.status(400).json({ msg: "Please fill description update for course" });
    }
    try {
        const admin = yield adminModel_1.adminModel.findOne({ _id: userId });
        if (!admin) {
            return res.status(401).json({ msg: "Only admin can perform this" });
        }
        const course = yield courseModel_1.courseModel.findOne({ _id: id });
        if (!course) {
            return res.status(404).json({ msg: "Course not found or deleted" });
        }
        const updatedCourse = yield courseModel_1.courseModel.findOneAndUpdate({ _id: id }, Object.assign({}, req.body), { new: true });
        return res.status(200).json({ msg: "Success update course", updatedCourse });
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateCourse = updateCourse;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.params;
    const adminId = req.user.userId;
    if (!userId) {
        return res.status(400).json({ msg: "Please provide target user" });
    }
    try {
        const admin = yield adminModel_1.adminModel.findOne({ _id: adminId });
        if (!admin) {
            return res.status(401).json({ msg: "Only admin can perform this" });
        }
        const user = yield userModel_1.userModel.findOneAndDelete({ _id: userId });
        return res.status(200).json({ msg: 'Success delete user', user });
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteUser = deleteUser;
const getSimpleStatistic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminId = req.user.userId;
    try {
        const admin = yield adminModel_1.adminModel.findOne({ _id: adminId });
        if (!admin) {
            return res.status(401).json({ msg: "Only admin can delete this" });
        }
        const totalUser = yield userModel_1.userModel.find({}).count();
        return res.status(200).json({
            msg: "Simple statistic", data: {
                totalUser: totalUser
            }
        });
    }
    catch (error) {
    }
});
exports.getSimpleStatistic = getSimpleStatistic;
