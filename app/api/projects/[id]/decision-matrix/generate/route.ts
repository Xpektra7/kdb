import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * POST /api/projects/[id]/decision-matrix/generate
 * 
 * Process decision matrix AI output and populate DB with subsystems + options
 * This is called AFTER the AI generates the decision matrix (see /api/generate/decision-matrix)
 * 
 * Request: {
 *   aiOutput: {
 *     project: string,
 *     concept: string,
 *     research: string[],
 *     problems_overall: [{problem: string, suggested_solution: string}],
 *     decision_matrix: [{
 *       subsystem: string,
 *       options: [{name, why_it_works, features, pros, cons, estimated_cost, availability}]
 *     }],
 *     skills: string
 *   }
 * }
 * 
 * Response: {
 *   projectId, subsystemCount, optionCount,
 *   subsystems: [{id, name, optionCount}]
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

    if (!aiOutput || !aiOutput.decision_matrix) {
      return NextResponse.json(
        { error: "Invalid AI output format" },
        { status: 400 }
      );
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true }
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Delete existing subsystems for this project (clean slate)
    await prisma.subsystem.deleteMany({
      where: { projectId }
    });

    // Create subsystems and options
    const subsystemsData = aiOutput.decision_matrix;
    const createdSubsystems = [];

    for (let i = 0; i < subsystemsData.length; i++) {
      const subsysData = subsystemsData[i];

      // Create subsystem
      const subsystem = await prisma.subsystem.create({
        data: {
          projectId,
          name: subsysData.subsystem,
          description: null,
          order: i
        }
      });

      // Create options for this subsystem
      const optionsData = subsysData.options || [];
      const createdOptions = [];

      for (const optionData of optionsData) {
        const option = await prisma.subsystemOption.create({
          data: {
            subsystemId: subsystem.id,
            name: optionData.name,
            description: optionData.why_it_works || "",
            whyItWorks: optionData.why_it_works || "",
            pros: optionData.pros || [],
            cons: optionData.cons || [],
            estimatedCost: optionData.estimated_cost || "N/A",
            availability: optionData.availability || "Unknown"
          }
        });
        createdOptions.push(option);
      }

      createdSubsystems.push({
        id: subsystem.id,
        name: subsystem.name,
        optionCount: createdOptions.length
      });
    }

    // Save decision matrix result to cache
    await prisma.decisionMatrixResult.upsert({
      where: { projectId },
      update: {
        aiOutput: aiOutput,
        projectTitle: aiOutput.project,
        concept: aiOutput.concept,
        problemsOverall: aiOutput.problems_overall,
        skillsRequired: aiOutput.skills,
        generatedAt: new Date()
      },
      create: {
        projectId,
        aiOutput: aiOutput,
        projectTitle: aiOutput.project,
        concept: aiOutput.concept,
        problemsOverall: aiOutput.problems_overall,
        skillsRequired: aiOutput.skills
      }
    });

    // Update project stage
    await prisma.project.update({
      where: { id: projectId },
      data: { stage: "DECISION_MATRIX" }
    });

    return NextResponse.json(
      {
        projectId,
        subsystemCount: createdSubsystems.length,
        optionCount: createdSubsystems.reduce((sum, s) => sum + s.optionCount, 0),
        subsystems: createdSubsystems
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/projects/[id]/decision-matrix/generate] Error:", error);
    return NextResponse.json(
      { error: "Failed to process decision matrix" },
      { status: 500 }
    );
  }
}
