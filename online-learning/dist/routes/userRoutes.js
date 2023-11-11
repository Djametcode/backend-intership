"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const auth_1 = require("../middleware/auth");
const multer_1 = require("../middleware/multer");
const router = express_1.default.Router();
router.post('/register', multer_1.upload.single("avatar"), userController_1.registerUser);
router.post('/login', userController_1.loginUser);
router.get('/course/get-category', auth_1.userAuthMiddleware, userController_1.getCategoryCourse);
router.get('/course/popular-course', auth_1.userAuthMiddleware, userController_1.getPopularCategory);
router.post('/course/get-course/:id', auth_1.userAuthMiddleware, userController_1.getCourse);
router.get('/course/get-detail/:id', auth_1.userAuthMiddleware, userController_1.getDetailCourse);
router.get('/course/search', auth_1.userAuthMiddleware, userController_1.searchCourse);
exports.userRoute = router;
