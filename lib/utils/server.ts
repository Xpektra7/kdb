import prisma from "../prisma"
import type { User as DbUser } from "../generated/prisma/client"

export const getUserFromDb = async (email: string): Promise<DbUser | null> => {
    return prisma.user.findUnique({
        where: { email },
    })
}