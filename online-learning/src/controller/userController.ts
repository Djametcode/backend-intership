import { Request, Response } from "express";
import { userModel } from "../model/userModel";
import { hashPassword } from "../helper/hashPassword";
import { generateJWT } from "../helper/generateJWT";
import { courseModel } from "../model/courseModel";

const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body

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

        const newUser = new userModel({
            username: username,
            email: email,
            password: hashedPass,
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

        const token = await generateJWT({ id: user._id, email: user.email })

        return res.status(200).json({ msg: "success", user, token })
    } catch (error) {
        console.log(error)
    }
}

const getCategoryCourse = async (req: Request, res: Response) => {
    const { category } = req.query

    if (!category || category == undefined) {
        return res.status(400).json({ msg: "Please provide category" })
    }

    if (category != 'backend' || 'frontend' || 'ui/ux' || 'other' || 'qa' || 'devops') {
        return res.status(400).json({ msg: "Please fill only right category" })
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

        return res.status(200).json({ msg: "Success", course })
    } catch (error) {
        console.log(error)
    }
}

const getCourse = async (req: Request, res: Response) => {
    const { id } = req.params
    const userId = req.user.userId

    try {
        const user = await userModel.findOne({ _id: userId })

        if (!user) {
            return res.status(401).json({ msg: "token invalid please login again" })
        }

        const course = await courseModel.findOne({ _id: id })

        if (course?._id !== undefined) {
            await user.myCourse.push({ courseId: course?._id })
            await user.save()

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
    const { name, sort } = req.query
    const regex = new RegExp(name as string, "i")

    try {
        if (name) {
            const course = await courseModel.find({ name: { $regex: { regex, $options: "i" } } })

            return res.status(200).json({ msg: "success", course })
        }

        if (name && sort === 'asc') {
            const course = await courseModel.find({ name: { $regex: { regex, $options: "i" } } }).sort({ price: 1 })

            return res.status(200).json({ msg: "success", course })
        }

        if (name && sort === 'desc') {
            const course = await courseModel.find({ name: { $regex: { regex, $options: "i" } } }).sort({ price: -1 })

            return res.status(200).json({ msg: "success", course })
        }

        if (name && sort === 'free') {
            const course = await courseModel.find({ name: { $regex: { regex, $options: "i" } } }).where({ isFree: true })

            return res.status(200).json({ msg: "success", course })
        }

        return res.status(400).json({ msg: "please provide correct query" })
    } catch (error) {
        console.log(error)
    }
}