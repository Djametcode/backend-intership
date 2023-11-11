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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuthMiddleware = exports.registAdminMiddleware = exports.adminAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "Please login as admin first" });
    }
    const token = header.split(" ")[1];
    try {
        const payload = yield jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.admin = { adminId: payload.userId, email: payload.email };
        next();
    }
    catch (error) {
        console.log(error);
    }
});
exports.adminAuthMiddleware = adminAuthMiddleware;
const registAdminMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { regCode } = req.query;
    try {
        console.log(regCode);
        if (!regCode) {
            return res.status(401).json({ msg: "please provide admin code" });
        }
        const check = regCode === process.env.SECRET_ADMIN;
        console.log(check);
        if (!check) {
            return res.status(401).json({ msg: "Please call one of our admin to get code" });
        }
        next();
    }
    catch (error) {
        console.log(error);
    }
});
exports.registAdminMiddleware = registAdminMiddleware;
const userAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "Please login first" });
    }
    const token = header.split(" ")[1];
    try {
        const payload = yield jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = { userId: payload.userId, email: payload.email };
        next();
    }
    catch (error) {
    }
});
exports.userAuthMiddleware = userAuthMiddleware;
