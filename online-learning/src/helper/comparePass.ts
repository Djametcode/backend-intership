import bcrypt from 'bcrypt'

interface IData {
    userInputPass: string | BufferEncoding;
    encryptedPass: string;
}

export const comparePass = async (data: IData) => {
    const isMatch = await bcrypt.compare(data.userInputPass, data.encryptedPass)
    return isMatch
}