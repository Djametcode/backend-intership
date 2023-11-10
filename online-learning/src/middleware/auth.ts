import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface IPayload {
    userId: string;
    email: string
}

export const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "Please login as admin first" })
    }

    const token = header.split(" ")[1]

    try {
        const payload = await jwt.verify(token, process.env.JWT_SECRET) as IPayload;

        req.user = { userId: payload.userId, email: payload.email }
        next()
    } catch (error) {
        console.log(error)
    }
}

export const registAdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { regCode } = req.query
    try {
        console.log(regCode)
        if (!regCode) {
            return res.status(401).json({ msg: "please provide admin code" })
        }

        const check = regCode === process.env.SECRET_ADMIN
        console.log(check)

        if (!check) {
            return res.status(401).json({ msg: "Please call one of our admin to get code" })
        }
        next()
    } catch (error) {
        console.log(error)
    }
}