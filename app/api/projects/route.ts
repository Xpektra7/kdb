import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * POST /api/projects
 * 
 * Create a new engineering project
 * 
 * Request: { title: string, description?: string }
 * Response: { id: number, title: string, stage: string, createdAt: string }
 * 
 * TODO: Add auth middleware to get userId from session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Project title is required" },
        { status: 400 }
      );
    }

    // TODO: Get userId from auth session
    const userId = 1; // Placeholder - replace with actual auth


    // check if user has a project that has not been completed (stage != COMPLETED)

    const uncompletedProject = await prisma.project.findFirst({
      where: {
        userId,
        NOT: {
          stage: "COMPLETED"
        }
      }
    });

    if (uncompletedProject) {
      return NextResponse.json(
        { error: "You have an uncompleted project. Please complete it before creating a new one." },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        userId,
        stage: "IDEATION"
      },
      select: {
        id: true,
        title: true,
        description: true,
        stage: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("[POST /api/projects] Error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/projects
 * 
 * Get all projects for authenticated user
 * 
 * Response: { projects: Project[] }
 */
// export async function GET(request: NextRequest) {
//   try {
//     // TODO: Get userId from auth session
//     const userId = 1; // Placeholder

//     const projects = await prisma.project.findMany({
//       where: { userId },
//       select: {
//         id: true,
//         title: true,
//         description: true,
//         stage: true,
//         createdAt: true,
//         updatedAt: true,
//         subsystems: { select: { id: true } },
//         decisions: { select: { id: true } }
//       },
//       orderBy: { updatedAt: "desc" }
//     });

//     return NextResponse.json({ projects }, { status: 200 });
//   } catch (error) {
//     console.error("[GET /api/projects] Error:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch projects" },
//       { status: 500 }
//     );
//   }
// }
