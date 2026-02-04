import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * POST /api/projects/[id]/blueprint/generate
 * 
 * Process blueprint AI output and save to cache
 * This is called AFTER:
 * 1. User has made all subsystem decisions
 * 2. AI has generated the blueprint (see /api/generate/blueprint)
 * 
 * Request: {
 *   aiOutput: {
 *     project: string,
 *     problem: {statement, constraints},
 *     architecture: {overview, block_diagram},
 *     components: [{subsystem, chosen_option, pros, cons}],
 *     execution_steps: string[],
 *     testing: {methods, success_criteria},
 *     references: string[],
 *     extensions: string[],
 *     cost: string,
 *     skills: string
 *   }
 * }
 * 
 * Response: {
 *   projectId, blueprintId, stage,
 *   architecture, estimatedCost, skills
 * }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);
    const body = await request.json();
    const { aiOutput } = body;

    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    if (!aiOutput) {
      return NextResponse.json(
        { error: "Invalid AI output format" },
        { status: 400 }
      );
    }

    // Verify project exists and has completed decision matrix
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, stage: true }
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Check that all decisions are made
    const subsystems = await prisma.subsystem.findMany({
      where: { projectId },
      include: { decisions: { select: { id: true } } }
    });

    const allDecided = subsystems.every(s => s.decisions.length > 0);
    if (!allDecided) {
      return NextResponse.json(
        { error: "Not all subsystems have been decided. Complete the decision matrix first." },
        { status: 400 }
      );
    }

    // Save blueprint result
    const blueprint = await prisma.$transaction(async (tx) => {
      const result = await tx.blueprintResult.upsert({
        where: { projectId },
        update: {
          generatedAt: new Date()
        },
        create: {
          projectId
        }
      });
      
      // Delete existing block diagram nodes and recreate
      await tx.blockDiagramNode.deleteMany({
        where: { blueprintId: result.id }
      });
      
      // Save block diagram nodes
      if (aiOutput.architecture?.block_diagram && Array.isArray(aiOutput.architecture.block_diagram)) {
        await tx.blockDiagramNode.createMany({
          data: aiOutput.architecture.block_diagram.map((nodeName: string, index: number) => ({
            blueprintId: result.id,
            name: nodeName,
            order: index
          }))
        });
      }
      
      // Save references as research
      if (aiOutput.references && Array.isArray(aiOutput.references) && aiOutput.references.length > 0) {
        await tx.projectResearch.createMany({
          data: aiOutput.references.map((source: string) => ({
            projectId,
            source,
            stage: "BLUEPRINT"
          }))
        });
      }
      
      return result;
    });

    // Update project stage
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { stage: "BLUEPRINT" }
    });

    return NextResponse.json(
      {
        projectId,
        blueprintId: blueprint.id,
        stage: updatedProject.stage,
        architecture: aiOutput.architecture?.overview,
        estimatedCost: aiOutput.cost,
        skills: aiOutput.skills
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/projects/[id]/blueprint/generate] Error:", error);
    return NextResponse.json(
      { error: "Failed to process blueprint" },
      { status: 500 }
    );
  }
}
