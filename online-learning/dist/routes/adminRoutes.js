"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controller/adminController");
const auth_1 = require("../middleware/auth");
const multer_1 = require("../middleware/multer");
const router = express_1.default.Router();
router.post('/create-course', multer_1.upload.single('file'), auth_1.adminAuthMiddleware, adminController_1.createCourse);
router.get('/get-all-course', auth_1.adminAuthMiddleware, adminController_1.getAllCourse);
router.post('/register-admin', multer_1.upload.single("file"), auth_1.registAdminMiddleware, adminController_1.registerAdmin);
router.post('/login-admin', adminController_1.loginAdmin);
router.delete('/delete-user/:id', auth_1.adminAuthMiddleware, adminController_1.deleteUser);
router.get('/get-statistic', adminController_1.getSimpleStatistic);
exports.adminRouter = router;
