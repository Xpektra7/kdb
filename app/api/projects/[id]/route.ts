import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/projects/[id]
 * 
 * Get single project with all subsystems, options, and decisions
 * 
 * Response: {
 *   id, title, description, stage,
 *   subsystems: [{ id, name, options: [...], decision: {...} }],
 *   decisionMatrix: {...},
 *   blueprint: {...}
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        subsystems: {
          orderBy: { order: "asc" },
          include: {
            options: {
              select: {
                id: true,
                name: true,
                features: true,
                why_it_works: true,
                pros: true,
                cons: true,
                estimated_cost: true,
                availability: true,
              }
            },
            decisions: {
              include: {
                selectedOption: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        },
        blueprint: {
          select: {
            id: true,
            //aiOutput: true,
            architecture: true,
            cost: true,
            skills: true,
            generatedAt: true,
            references:true
          }
        },
        buildGuide: {
          select: {
            id: true,
            //aiOutput: true,
            generatedAt: true
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error("[GET /api/projects/[id]] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projects/[id]
 * 
 * Update project (title, description)
 * 
 * Request: { title?: string, description?: string }
 * Response: Updated project
 */
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const projectId = parseInt(id);

//     if (isNaN(projectId)) {
//       return NextResponse.json(
//         { error: "Invalid project ID" },
//         { status: 400 }
//       );
//     }

//     const body = await request.json();
//     const { title, concept } = body;

//     const project = await prisma.project.update({
//       where: { id: projectId },
//       data: {
//         ...(title && { title: title.trim() }),
//         ...(concept !== undefined && { concept: concept?.trim() || null })
//       },
//       select: {
//         id: true,
//         title: true,
//         concept: true,
//         stage: true,
//         updatedAt: true
//       }
//     });

//     return NextResponse.json(project, { status: 200 });
//   } catch (error: any) {
//     if (error.code === "P2025") {
//       return NextResponse.json(
//         { error: "Project not found" },
//         { status: 404 }
//       );
//     }
//     console.error("[PUT /api/projects/[id]] Error:", error);
//     return NextResponse.json(
//       { error: "Failed to update project" },
//       { status: 500 }
//     );
//   }
// }

/**
 * DELETE /api/projects/[id]
 * 
 * Delete project and all related data
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    await prisma.project.delete({
      where: { id: projectId }
    });

    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }
    console.error("[DELETE /api/projects/[id]] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
