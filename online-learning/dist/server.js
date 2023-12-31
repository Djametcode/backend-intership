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
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cloudinary_1 = require("cloudinary");
const app = (0, express_1.default)();
const connectDB_1 = require("./database/connectDB");
const adminRoutes_1 = require("./routes/adminRoutes");
const userRoutes_1 = require("./routes/userRoutes");
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/online-learning/admin', adminRoutes_1.adminRouter);
app.use('/api/online-learning/user', userRoutes_1.userRoute);
cloudinary_1.v2.config({
    api_key: process.env.API_KEY,
    cloud_name: process.env.CLOUD_NAME,
    api_secret: process.env.API_SECRET
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connectDB_1.connectDB)(process.env.MONGO_URL);
        app.listen(process.env.PORT || 3000);
    }
    catch (error) {
        console.log(error);
    }
});
startServer();
