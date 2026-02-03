import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const { email, name, password } = await req.json();
        const user = await prisma.user.create({
            data: {
                email, name, password,
            },
        })

        return NextResponse.json({ user }, { status: 201 });
    } catch (err) {
        console.error("API route error:", err);
        return new NextResponse(
            JSON.stringify({ error: "Failed to create user", details: String(err) }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json({ users }, { status: 200 });
    } catch (err) {
        console.error("API route error:", err);
        return new NextResponse(
            JSON.stringify({ error: "Failed to fetch users", details: String(err) }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {

        await prisma.user.deleteMany();
        return NextResponse.json({ message: "All users deleted" }, { status: 200 });
    } catch (err) {
        console.error("API route error:", err);
        return new NextResponse(
            JSON.stringify({ error: "Failed to delete users", details: String(err) }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}