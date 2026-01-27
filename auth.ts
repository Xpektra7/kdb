import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./lib/prisma"
import { authConfig } from "./app/auth/config"
 
export const { handlers, auth } = NextAuth({
    adapter:PrismaAdapter(prisma),
    ...authConfig,
 
})