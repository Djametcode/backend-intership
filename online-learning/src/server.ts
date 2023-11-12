import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { v2 as cloudinary } from 'cloudinary'
const app = express()

import { connectDB } from './database/connectDB'
import { adminRouter } from './routes/adminRoutes'
import { userRoute } from './routes/userRoutes'

app.use(cors())
app.use(express.json())
app.use('/api/online-learning/admin', adminRouter)
app.use('/api/online-learning/user', userRoute)

cloudinary.config({
    api_key: process.env.API_KEY,
    cloud_name: process.env.CLOUD_NAME,
    api_secret: process.env.API_SECRET
})

const startServer = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(process.env.PORT || 3000)
    } catch (error) {
        console.log(error)
    }
}

startServer()