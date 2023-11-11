import { Request, Response } from "express";
import { userModel } from "../model/userModel";
import { hashPassword } from "../helper/hashPassword";
import { generateJWT } from "../helper/generateJWT";
import { courseModel } from "../model/courseModel";
import { comparePass } from "../helper/comparePass";
import { v2 as cloudinary } from 'cloudinary'

const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body
    let file = req.file

    if (!username) {
        return res.status(400).json({ msg: "Please provide username" })
    }

    if (!email) {
        return res.status(400).json({ msg: "Please provide email" })
    }

    try {
        const checkUser = await userModel.findOne({ email: email })

        if (checkUser) {
            return res.status(400).json({ msg: "email already registered" })
        }

        const hashedPass = await hashPassword(password)

        if (!file) {
            const newUser = new userModel({
                username: username,
                email: email,
                password: hashedPass,
                avatar: ""
            })

            const user = await userModel.create(newUser)

            return res.status(200).json({ msg: "success", user })
        }

        const image = await cloudinary.uploader.upload(file.path, {
            folder: 'Testing',
            resource_type: 'auto'
        })

        const newUser = new userModel({
            username: username,
            email: email,
            password: hashedPass,
            avatar: image.secure_url
        })

        const user = await userModel.create(newUser)

        return res.status(200).json({ msg: "success", user })


    } catch (error) {
        console.log(error)
    }
}

const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email) {
        return res.status(400).json({ msg: 'Please fill email' })
    }

    try {
        const user = await userModel.findOne({ email: email })

        if (!user) {
            return res.status(404).json({ msg: "Email not registered yet" })
        }

        const isPassCorrect = await comparePass({ userInputPass: password, encryptedPass: user.password })

        if (!isPassCorrect) {
            return res.status(401).json({ msg: "Password wrong" })
        }

        const token = generateJWT({ id: user._id, email: user.email })

        return res.status(200).json({ msg: "success", user, token })
    } catch (error) {
        console.log(error)
    }
}

const getCategoryCourse = async (req: Request, res: Response) => {
    const { category } = req.query

    if (!category || category == undefined) {
        return res.status(400).json({ msg: "Please provide category query" })
    }

    try {
        const course = await courseModel.find({ courseCategory: category })

        return res.status(200).json({ msg: "success", course });
    } catch (error) {
        console.log(error)
    }
}

const getPopularCategory = async (req: Request, res: Response) => {
    try {
        const course = await courseModel.find({})
    } catch (error) {
        console.error("Error:", error);
    }
};

const getCourse = async (req: Request, res: Response) => {
    const { id } = req.params
    const userId = req.user.userId

    try {
        const user = await userModel.findOne({ _id: userId })

        if (!user) {
            return res.status(401).json({ msg: "token invalid please login again" })
        }

        const course = await courseModel.findOne({ _id: id })

        const userCheck = user.myCourse.findIndex((item) => item.courseId.equals(course?._id))

        if (userCheck !== -1) {
            return res.status(400).json({ msg: "You only can buy once" })
        }

        if (course?._id !== undefined) {
            user.myCourse.push({ courseId: course?._id })
            course.totalSold.push({ userId: user._id })

            await user.save()
            await course.save()

            return res.status(200).json({ msg: "success", course, user })
        }

    } catch (error) {
        console.log(error)
    }
}

const getDetailCourse = async (req: Request, res: Response) => {
    const { id: courseId } = req.params
    const userId = req.user.userId

    try {
        const course = await courseModel.findOne({ _id: courseId })

        if (!course) {
            return res.status(404).json({ msg: "course not found" })
        }

        return res.status(200).json({ msg: "success", course })
    } catch (error) {
        console.log(error)
    }
}

const searchCourse = async (req: Request, res: Response) => {
    const { name, price } = req.query;

    try {
        if (name) {
            const regex = new RegExp(name as string, 'i');

            let query = courseModel.find({ name: { $regex: regex } });

            if (price === 'asc') {
                query.sort({ price: 1 })
            }

            if (price === 'desc') {
                query.sort({ price: -1 })
            }

            if (price === 'free') {
                query.where({ isFree: true })
            }

            const courses = await query.exec();

            return res.status(200).json({ msg: 'success', courses });
        } else {
            return res.status(400).json({ msg: 'Please provide a search term' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
};

export { registerUser, loginUser, getCategoryCourse, getPopularCategory, getCourse, getDetailCourse, searchCourse }