import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import z from "zod";

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


// create a validation schema for the expected AI output format
const aiOutputSchema = z.object({
  project: z.union([
    z.object({ title: z.string() }),
    z.string()
  ]).optional(),
  problem: z.object({
    statement: z.string(),
    constraints: z.array(z.string())
  }),
  architecture: z.object({
    overview: z.string(),
    block_diagram: z.array(z.string()).optional()
  }),
  components: z.array(z.object({
    subsystem: z.string(),
    chosen_option: z.string(),
    why_chosen: z.string(),
    pros: z.array(z.string()).optional(),
    cons: z.array(z.string()).optional()
  })).optional(),
  execution_steps: z.array(z.string()),
  testing: z.object({
    methods: z.array(z.string()),
    success_criteria: z.string()
  }),
  references: z.array(z.string()),
  extensions: z.array(z.string()),
  cost: z.string(),
  skills: z.union([z.array(z.string()), z.string()])
});

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

    // Validate AI output structure
    const parseResult = aiOutputSchema.safeParse(aiOutput);
    if (!parseResult.success) {
      console.error("AI output validation failed:", parseResult.error);
      return NextResponse.json(
        { error: "AI output is missing required fields or has invalid types" },
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

    const { architecture, cost, skills, execution_steps, references, extensions, problem, testing } = parseResult.data;

    // Save blueprint result with transaction to ensure consistency
    const blueprint = await prisma.$transaction(async (tx) => {
      // Upsert blueprint result
      const bp = await tx.blueprintResult.create({
        data: {
          projectId, cost, executionSteps: execution_steps, references, extensions,
          skills: Array.isArray(skills) ? skills : skills.split(",").map((item) => item.trim()).filter(Boolean),
        }
    });

      // Save architecture details
      await tx.architecture.create({
        data: {
          blueprintId: bp.id, ...architecture,
        }
      });
      await tx.problem.create({
        data: {
          blueprintId: bp.id,
          statment: problem.statement,
          constraints: problem.constraints,
        }
      });
      await tx.testing.create({
        data: {
          blueprintId: bp.id, ...testing,
        }
      });

      // we also need to fetch decision details to link components to decisions
      const decisions = await tx.projectDecision.findMany({
        where: { projectId },
        include: {
          subsystem: {
            select: { name: true }
          },
          selectedOption: {
            select: { name: true, why_it_works: true, pros: true, cons: true }
          }
        }
      });

      // Save components with links to decisions

      return {bp, decisions};
  })
    // Update project stage
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { stage: "BLUEPRINT" }
    });

    return NextResponse.json(
      {
        projectId,
       blueprint
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
