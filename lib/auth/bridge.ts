"use server"

import { verifyPassword } from "@/lib/utils/index"
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
