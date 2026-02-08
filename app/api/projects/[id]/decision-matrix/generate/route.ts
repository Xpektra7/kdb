import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const normalizeEstimatedCost = (value?: string | string[] | null): string => {
  if (!value) {
    return "N/A";
  }
  if (Array.isArray(value)) {
    const cleaned = value.map((item) => item.trim()).filter(Boolean);
    return cleaned.length ? cleaned.join(", ") : "N/A";
  }
  const cleaned = value.trim();
  return cleaned || "N/A";
};

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
 *     goals: string[],
 *     problems_overall: [{problem: string, suggested_solution: string}],
 *     decision_matrix: [{
 *       subsystem: string,
 *       from: string|string[]|null,
 *       to: string|string[]|null,
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
    const createdSubsystems = await prisma.$transaction(async (tx) => {
      const created = [];

      for (let i = 0; i < subsystemsData.length; i++) {
        const subsysData = subsystemsData[i];
        
        const inputFrom = subsysData.from 
          ? (Array.isArray(subsysData.from) ? subsysData.from : [subsysData.from])
          : [];
        const outputTo = subsysData.to
          ? (Array.isArray(subsysData.to) ? subsysData.to : [subsysData.to])
          : [];

        // Create subsystem
        const subsystem = await tx.subsystem.create({
          data: {
            projectId,
            name: subsysData.subsystem,
            description: null,
            order: i,
            inputFrom,
            outputTo
          }
        });

        // Create options for this subsystem
        const optionsData = subsysData.options || [];
        const createdOptions = [];

        for (const optionData of optionsData) {
          const option = await tx.subsystemOption.create({
            data: {
              subsystemId: subsystem.id,
              name: optionData.name,
              description: optionData.why_it_works || "",
              whyItWorks: optionData.why_it_works || "",
              features: optionData.features || [],
              pros: optionData.pros || [],
              cons: optionData.cons || [],
              estimatedCost: normalizeEstimatedCost(optionData.estimated_cost),
              availability: optionData.availability || "Unknown"
            }
          });
          createdOptions.push(option);
        }

        created.push({
          id: subsystem.id,
          name: subsystem.name,
          optionCount: createdOptions.length
        });
      }

      // Get userId from project
      const projectData = await tx.project.findUnique({
        where: { id: projectId },
        select: { userId: true }
      });
      const userId = projectData?.userId || "";

      // Save decision matrix result
      // await tx.decisionMatrixResult.upsert({
      //   where: { projectId },
      //   update: {
      //     generatedAt: new Date()
      //   },
      //   create: {
      //     projectId
      //   }
      // });
      
      // Save research sources
      // if (aiOutput.research && aiOutput.research.length > 0) {
      //   await tx.projectResearch.createMany({
      //     data: aiOutput.research.map((source: { title: string; url: string }) => ({
      //       projectId,
      //       source: source.title,
      //       url: source.url,
      //     }))
      //   });
      // }

      // Update project with goals and stage
      await tx.project.update({
        where: { id: projectId },
        data: { 
          stage: "DECISION_MATRIX",
          goals: aiOutput.goals || []
        }
      });

      // Track AI generation
      await tx.aIGeneration.create({
        data: {
          projectId,
          userId,
          stage: "DECISION_MATRIX",
          status: "SUCCESS"
        }
      });

      return created;
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
