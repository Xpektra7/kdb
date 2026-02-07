import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/projects/[id]/decision-matrix
 * 
 * Get cached decision matrix result
 * Returns from cache if available and not expired
 * 
 * Response: {
 *   id, projectTitle, concept, problemsOverall, skillsRequired,
 *   aiOutput: {...}, generatedAt, expiresAt
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

    // const result = await prisma.decisionMatrixResult.findUnique({
    //   where: { projectId }
    // });

   const result = await prisma.project.findFirst({
      where: { id: projectId },include:{
        project_overall:true,
        research:true,
        subsystems:{include:{options:true,}}
      }})

    if (!result) {
      return NextResponse.json(
        { error: "Decision matrix not yet generated for this project" },
        { status: 404 }
      );
    }

    // Check if expired
    // if (new Date() > result.) {
    //   return NextResponse.json(
    //     { error: "Decision matrix has expired. Please regenerate." },
    //     { status: 410 }
    //   );
    // }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[GET /api/projects/[id]/decision-matrix] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch decision matrix" },
      { status: 500 }
    );
  }
}
