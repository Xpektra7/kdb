import { hash, compare, genSalt } from "bcryptjs"

export const saltAndHashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10
    const salt = await genSalt(saltRounds)
    const hashedPassword = await hash(password, salt)
    return hashedPassword
}

export const verifyPassword = async (password: string, hashValue: string): Promise<boolean> => {
    return compare(password, hashValue)
}

