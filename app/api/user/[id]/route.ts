import { NextRequest,NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET(req: NextRequest,ctx:RouteContext<'/api/user/[id]'>) {
    const { id } = await ctx.params;
    try {
        const user = await prisma.user.findUnique({where:{id:Number(id)}});
        return NextResponse.json({ user }, { status: 200 });
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