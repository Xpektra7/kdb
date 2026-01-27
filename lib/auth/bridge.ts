"use server"

import prisma from "@/lib/prisma"
import { saltAndHashPassword, verifyPassword } from "@/lib/utils/index"
import { getUserFromDb } from "@/lib/utils/server"

export async function authenticateUser(
  email: string,
  password: string
) {
  const dbUser = await getUserFromDb(email)
  if (!dbUser) return null

  const isValid = await verifyPassword(password, dbUser.password)
  if (!isValid) return null

  // Map Prisma user to the shape NextAuth expects
  return {
    id: dbUser.id.toString(),
    email: dbUser.email,
    name: dbUser.name ?? undefined,
  }
}

export async function registerUser(
  email: string,
  password: string,
  name?: string
) {
  const existing = await getUserFromDb(email)
  if (existing) return null

  const passwordHash = await saltAndHashPassword(password)

  const dbUser = await prisma.user.create({
    data: {
      email,
      password: passwordHash,
      name,
    },
  })

  return {
    id: dbUser.id.toString(),
    email: dbUser.email,
    name: dbUser.name ?? undefined,
  }
}
