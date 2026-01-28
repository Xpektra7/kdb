import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * POST /api/projects/[id]/stage
 * 
 * Update project stage with validation
 * Only allows valid stage transitions
 * 
 * Request: { stage: ProjectStage }
 * 
 * Allowed transitions:
 * IDEATION → DECISION_MATRIX
 * DECISION_MATRIX → DECISION_MATRIX_COMPLETE (after all decisions made)
 * DECISION_MATRIX_COMPLETE → BLUEPRINT
 * BLUEPRINT → BLUEPRINT_COMPLETE
 * BLUEPRINT_COMPLETE → BUILDING
 * BUILDING → COMPLETED
 * 
 * Response: { id, title, stage, updatedAt }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);
    const body = await request.json();
    const { stage } = body;

    if (isNaN(projectId) || !stage) {
      return NextResponse.json(
        { error: "Invalid project ID or stage" },
        { status: 400 }
      );
    }

    // Get current project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        subsystems: {
          include: { decisions: { select: { id: true } } }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Validate stage transition
    const validTransitions: Record<string, string[]> = {
      IDEATION: ["DECISION_MATRIX"],
      DECISION_MATRIX: ["DECISION_MATRIX_COMPLETE"],
      DECISION_MATRIX_COMPLETE: ["BLUEPRINT", "DECISION_MATRIX"],
      BLUEPRINT: ["BLUEPRINT_COMPLETE"],
      BLUEPRINT_COMPLETE: ["BUILDING", "BLUEPRINT"],
      BUILDING: ["COMPLETED", "BLUEPRINT_COMPLETE"],
      COMPLETED: []
    };

    if (!validTransitions[project.stage]?.includes(stage)) {
      return NextResponse.json(
        { error: `Cannot transition from ${project.stage} to ${stage}` },
        { status: 400 }
      );
    }

    // Additional validation for specific transitions
    if (stage === "DECISION_MATRIX_COMPLETE") {
      // Check all subsystems have decisions
      const allDecided = project.subsystems.every(s => s.decisions.length > 0);
      if (!allDecided) {
        return NextResponse.json(
          { error: "Cannot mark complete: not all subsystems have decisions" },
          { status: 400 }
        );
      }
    }

    if (stage === "BLUEPRINT") {
      // Check blueprint exists in cache
      const blueprint = await prisma.blueprintResult.findUnique({
        where: { projectId }
      });
      if (!blueprint) {
        return NextResponse.json(
          { error: "Blueprint must be generated before transitioning to BLUEPRINT stage" },
          { status: 400 }
        );
      }
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { stage },
      select: {
        id: true,
        title: true,
        stage: true,
        updatedAt: true
      }
    });

    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    console.error("[POST /api/projects/[id]/stage] Error:", error);
    return NextResponse.json(
      { error: "Failed to update stage" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/projects/[id]/stage
 * 
 * Get current project stage and progress info
 * 
 * Response: {
 *   projectId, currentStage,
 *   subsystemsTotal, subsystemsDecided,
 *   hasDecisionMatrix, hasBlueprint,
 *   progress: percentage
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
          include: { decisions: { select: { id: true } } },
          select: { id: true, decisions: true }
        },
        decisionMatrix: { select: { id: true } },
        blueprint: { select: { id: true } }
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const subsystemsTotal = project.subsystems.length;
    const subsystemsDecided = project.subsystems.filter(
      s => s.decisions.length > 0
    ).length;

    // Calculate progress based on stage
    let progress = 0;
    if (project.stage === "IDEATION") progress = 10;
    else if (project.stage === "DECISION_MATRIX") progress = 25 + (subsystemsTotal > 0 ? (subsystemsDecided / subsystemsTotal) * 40 : 0);
    else if (project.stage === "DECISION_MATRIX_COMPLETE") progress = 65;
    else if (project.stage === "BLUEPRINT") progress = 80;
    else if (project.stage === "BLUEPRINT_COMPLETE") progress = 90;
    else if (project.stage === "BUILDING") progress = 95;
    else if (project.stage === "COMPLETED") progress = 100;

    return NextResponse.json(
      {
        projectId,
        currentStage: project.stage,
        subsystemsTotal,
        subsystemsDecided,
        hasDecisionMatrix: !!project.decisionMatrix,
        hasBlueprint: !!project.blueprint,
        progress: Math.round(progress)
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/projects/[id]/stage] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stage info" },
      { status: 500 }
    );
  }
}
