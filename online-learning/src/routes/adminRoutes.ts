import express from 'express'
import { createCourse, getAllCourse, registerAdmin, deleteUser, getSimpleStatistic, loginAdmin } from '../controller/adminController'
import { adminAuthMiddleware, registAdminMiddleware } from '../middleware/auth';
import { upload } from '../middleware/multer';
const router = express.Router()

router.post('/create-course', upload.single('file'), adminAuthMiddleware, createCourse);
router.get('/get-all-course', adminAuthMiddleware, getAllCourse)
router.post('/register-admin', upload.single("file"), registAdminMiddleware, registerAdmin)
router.post('/login-admin', loginAdmin)
router.delete('/delete-user/:id', adminAuthMiddleware, deleteUser)
router.get('/get-statistic', getSimpleStatistic)

export const adminRouter = router