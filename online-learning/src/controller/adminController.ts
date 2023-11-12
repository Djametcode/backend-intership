import { Request, Response } from "express";
import { courseModel } from "../model/courseModel";
import { adminModel } from "../model/adminModel";
import { hashPassword } from "../helper/hashPassword";
import { userModel } from "../model/userModel";
import { comparePass } from "../helper/comparePass";
import { generateJWT } from "../helper/generateJWT";
import { v2 as cloudinary } from 'cloudinary'

const registerAdmin = async (req: Request, res: Response) => {
    const { username, email, password } = req.body

    let file = req.file


    if (!username) {
        return res.status(400).json({ msg: "Please fill username" })
    }

    if (!email) {
        return res.status(400).json({ msg: "Please fill email" })
    }

    if (!file) {
        return res.status(400).json({ msg: "Please attach file" })
    }

    try {
        const user = await adminModel.findOne({ email: email })

        if (user) {
            return res.status(400).json({ msg: "email already registered" })
        }

        const image = await cloudinary.uploader.upload(file.path, {
            folder: 'Testing',
            resource_type: 'auto'
        })

        const hashedPass = await hashPassword(password)

        const newAdmin = new adminModel({
            username: username,
            email: email,
            password: hashedPass,
            avatar: image.secure_url
        })

        const admin = await adminModel.create(newAdmin);

        return res.status(200).json({ msg: "Success regist admin", admin })
    } catch (error) {
        console.log(error)
    }
}

const loginAdmin = async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email) {
        return res.status(400).json({ msg: "Please fill email" })
    }

    try {
        const admin = await adminModel.findOne({ email: email })
        console.log(admin?.password)

        if (!admin) {
            return res.status(401).json({ msg: "Email not registered yet" })
        }

        const isPassCorrect = await comparePass({ userInputPass: password, encryptedPass: admin?.password as string })
        console.log(isPassCorrect)

        if (!isPassCorrect) {
            return res.status(401).json({ msg: "Password wrong" })
        }

        const token = await generateJWT({ id: admin?._id, email: admin?.email })
        return res.status(200).json({ msg: "success", admin, token })
    } catch (error) {
        console.log(error)
    }

}


const createCourse = async (req: Request, res: Response) => {
    const { name, price, description, category } = req.body
    const adminId = req.admin.adminId

    let file = req.file?.path;

    try {
        const admin = await adminModel.findOne({ _id: adminId })

        if (!admin) {
            return res.status(401).json({ msg: "Token Invalid or only admin can create course, please login again" })
        }

        if (!file || file == undefined) {
            return res.status(400).json({ msg: "Please attach file" })
        }

        const image = await cloudinary.uploader.upload(file, {
            folder: 'Testing',
            resource_type: 'auto',
        })

        const newCourse = new courseModel({
            name: name,
            price: price,
            description: description,
            owner: adminId,
            courseImage: [image.secure_url],
            courseCategory: category
        })

        const course = await courseModel.create(newCourse)

        admin.createdCourse.push({ courseId: course._id })
        await admin.save()

        return res.status(200).json({ msg: 'Success', course })
    } catch (error) {
        console.log(error)
    }
}

const getAllCourse = async (req: Request, res: Response) => {
    const adminId = req.admin.adminId
    try {
        const admin = await adminModel.findOne({ _id: adminId })

        if (!admin) {
            return res.status(401).json({ msg: "Token invalid" })
        }

        const course = await courseModel.find({})

        return res.status(200).json({ msg: 'Success', course })
    } catch (error) {
        console.log(error)
    }
}

const updateCourse = async (req: Request, res: Response) => {
    const { id } = req.params;
    const adminId = req.admin.adminId

    const { name, price, description } = req.body;

    if (!name) {
        return res.status(400).json({ msg: 'Please fill name update for course' })
    }

    if (!price) {
        return res.status(400).json({ msg: "Please fill price update for course" })
    }

    if (!description) {
        return res.status(400).json({ msg: "Please fill description update for course" })
    }

    try {
        const admin = await adminModel.findOne({ _id: adminId })

        if (!admin) {
            return res.status(401).json({ msg: "Token invalid or only admin can perform this, please login again" })
        }

        const course = await courseModel.findOne({ _id: id })

        if (!course) {
            return res.status(404).json({ msg: "Course not found or deleted" })
        }

        const updatedCourse = await courseModel.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true })

        return res.status(200).json({ msg: "Success update course", updatedCourse })
    } catch (error) {
        console.log(error)
    }
}

const getCourseById = async (req: Request, res: Response) => {
    const { id } = req.params
    const adminId = req.admin.adminId

    try {
        const admin = await adminModel.findOne({ _id: adminId })

        if (!admin) {
            return res.status(401).json({ msg: "Token invalid" })
        }

        const course = await courseModel.findOne({ _id: id }).populate({ path: "owner", select: ["_id", "username", "email"] })

        if (!course) {
            return res.status(404).json({ msg: 'course not found' })
        }

        return res.status(200).json({ msg: "success", course })
    } catch (error) {
        console.log(error)
    }
}

const deleteCourse = async (req: Request, res: Response) => {
    const { id: courseId } = req.params
    const adminId = req.admin.adminId

    try {
        const admin = await adminModel.findOne({ _id: adminId })

        if (!admin) {
            return res.status(401).json({ msg: "Token invalid" })
        }

        const courseOwner = await courseModel.findOne({ _id: courseId })
        console.log(courseOwner?._id)

        const checkOwner = courseOwner?.owner._id.toString() === admin._id.toString()
        console.log(checkOwner)

        if (!checkOwner) {
            return res.status(401).json({ msg: "Only owner can delete this" })
        }

        const course = await courseModel.findOneAndDelete({ _id: courseId })

        const courseIndex = admin.createdCourse.findIndex((item) => item.courseId.equals(courseId))

        if (courseIndex === - 1) {
            return res.status(400).json({ msg: "course already deleted" })
        }


        admin.createdCourse.splice(courseIndex, 1)
        await admin.save()


        return res.status(200).json({ msg: "success", course, admin })
    } catch (error) {
        console.log(error)
    }
}

const deleteUser = async (req: Request, res: Response) => {
    const { id: userId } = req.params
    const adminId = req.admin.adminId;

    if (!userId) {
        return res.status(400).json({ msg: "Please provide target user" })
    }

    try {
        const admin = await adminModel.findOne({ _id: adminId })

        if (!admin) {
            return res.status(401).json({ msg: "Token invalid, or only admin can perform this, please login again" })
        }

        const user = await userModel.findOneAndDelete({ _id: userId })

        return res.status(200).json({ msg: 'Success delete user', user })
    } catch (error) {
        console.log(error)
    }
}

const getSimpleStatistic = async (req: Request, res: Response) => {
    const adminId = req.admin.adminId;

    try {
        const admin = await adminModel.findOne({ _id: adminId })

        if (!admin) {
            return res.status(401).json({ msg: "Only admin can perform this" })
        }

        const totalUser = await userModel.find({}).count()
        const totalCourse = await courseModel.find({}).count()
        const totalFreeCourse = await courseModel.find({}).where({ isFree: true }).count()

        return res.status(200).json({
            msg: "Simple statistic", data: {
                totalUser: totalUser,
                totalCourse: totalCourse,
                totalFreeCourse: totalFreeCourse

            }
        })
    } catch (error) {

    }
}

export { createCourse, getAllCourse, updateCourse, registerAdmin, deleteUser, getSimpleStatistic, loginAdmin, deleteCourse, getCourseById }