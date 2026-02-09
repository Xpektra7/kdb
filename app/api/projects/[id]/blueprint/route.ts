import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Blueprint } from "@/lib/definitions";

/**
 * GET /api/projects/[id]/blueprint
 * 
 * Get cached blueprint result
 * Returns from cache if available and not expired
 * 
 * Response: {
 *   id, architecture, blockDiagram, estimatedTotalCost,
 *   requiredSkills, executionSteps,
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

    const result = await prisma.blueprintResult.findUnique({
      where: { projectId },
      include: {
        architecture: true,
        problem: true,
        project: { select: { title: true } },
        testing: true
      }
    });

    const components = await prisma.projectDecision.findMany({
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

    if (!result || !components) {
      return NextResponse.json(
        { error: "Blueprint not yet generated for this project" },
        { status: 404 }
      );
    }

    // Check if expired
    if (new Date() > result.expiresAt) {
      return NextResponse.json(
        { error: "Blueprint has expired. Please regenerate." },
        { status: 410 }
      );
    }


    const response: Blueprint = {
      project: { title: result.project.title },
      problem: result.problem
        ? { statement: result.problem.statment, constraints: result.problem.constraints }
        : { statement: "", constraints: [] },
      architecture: result.architecture
        ? {
            overview: result.architecture.overview,
            block_diagram: result.architecture.block_diagram,
            data_flow: undefined
          }
        : { overview: "", block_diagram: [] },
      components: components.map((component) => ({
        subsystem: { name: component.subsystem.name },
        selectedOption: {
          name: component.selectedOption.name,
          why_it_works: component.selectedOption.why_it_works,
          pros: component.selectedOption.pros || [],
          cons: component.selectedOption.cons || []
        }
      })),
      execution_steps: result.executionSteps,
      testing: result.testing
        ? { methods: result.testing.methods, success_criteria: result.testing.success_criteria }
        : { methods: [], success_criteria: "" },
      references: result.references || [],
      extensions: result.extensions || [],
      cost: result.cost,
      skills: result.skills || []
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("[GET /api/projects/[id]/blueprint] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blueprint" },
      { status: 500 }
    );
  }
}
