"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateJWT = (data) => {
    const token = jsonwebtoken_1.default.sign({ userId: data.id, email: data.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TIMES });
    return token;
};
exports.generateJWT = generateJWT;
