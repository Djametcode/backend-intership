import jwt from "jsonwebtoken";
import { Types } from "mongoose";

interface Tosign {
    id?: string | Types.ObjectId,
    email?: string,
}

const generateJWT = (data: Tosign) => {
    const token = jwt.sign({ userId: data.id, email: data.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TIMES })
    return token;
}

export { generateJWT }