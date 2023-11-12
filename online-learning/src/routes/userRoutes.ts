import exprees from 'express'
import { getCategoryCourse, getCourse, getDetailCourse, getPopularCategory, loginUser, registerUser, searchCourse } from '../controller/userController'
import { userAuthMiddleware } from '../middleware/auth'
import { upload } from '../middleware/multer'
const router = exprees.Router()

router.post('/register', upload.single("image"), registerUser)
router.post('/login', loginUser)
router.get('/course/get-category', userAuthMiddleware, getCategoryCourse)
router.get('/course/popular-course', userAuthMiddleware, getPopularCategory)
router.post('/course/get-course/:id', userAuthMiddleware, getCourse)
router.get('/course/get-detail/:id', userAuthMiddleware, getDetailCourse)
router.get('/course/search', userAuthMiddleware, searchCourse)

export const userRoute = router