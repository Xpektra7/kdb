import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { registerUser } from "@/lib/auth/bridge"
import { signUpSchema } from "@/lib/zod"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name } = await signUpSchema.parseAsync(body)

    const user = await registerUser(email, password, name)
    if (!user) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid input", issues: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
