import express from 'express'
import { createCourse, getAllCourse, registerAdmin, deleteUser, getSimpleStatistic, loginAdmin, updateCourse, deleteCourse, getCourseById } from '../controller/adminController'
import { adminAuthMiddleware, registAdminMiddleware } from '../middleware/auth';
import { upload } from '../middleware/multer';
const router = express.Router()

router.post('/create-course', adminAuthMiddleware, upload.single("image"), createCourse);
router.patch('/update-course/:id', adminAuthMiddleware, updateCourse)
router.get('/get-all-course', adminAuthMiddleware, getAllCourse)
router.delete('/delete-course/:id', adminAuthMiddleware, deleteCourse)
router.post('/register-admin', upload.single("image"), registAdminMiddleware, registerAdmin)
router.post('/login-admin', loginAdmin)
router.delete('/delete-user/:id', adminAuthMiddleware, deleteUser)
router.get('/get-statistic', adminAuthMiddleware, getSimpleStatistic)
router.get('/get-course-detail/:id', adminAuthMiddleware, getCourseById)

export const adminRouter = router