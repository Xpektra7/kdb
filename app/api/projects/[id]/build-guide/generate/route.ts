import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import z from "zod";

/**
 * POST /api/projects/[id]/build-guide/generate
 * 
 * Process build guide AI output and save to database
 * This is called AFTER the AI generates the build guide
 * 
 * Request: {
 *   aiOutput: {
 *     project: string,
 *     build_overview: string,
 *     prerequisites: {tools: string[], materials: string[]},
 *     wiring: {description: string, connections: string[]},
 *     firmware: {language: string, structure: string[], key_logic: string[]},
 *     calibration: string[],
 *     testing: {unit: string[], integration: string[], acceptance: string[]},
 *     common_failures: [{issue: string, cause: string, fix: string}],
 *     safety: string[],
 *     next_steps: string[]
 *   }
 * }
 * 
 * Response: {
 *   projectId, buildGuideId, stage
 * }
 */


const aiOutputSchema = z.object({
  project: z.string(),
  build_overview: z.string(),
  prerequisites: z.object({
    tools: z.array(z.string()),
    materials: z.array(z.string())
  }),
  wiring: z.object({
    description: z.string(),
    connections: z.array(z.string())
  }),
  firmware: z.object({
    language: z.string(),
    structure: z.array(z.string()),
    key_logic: z.array(z.string())
  }),
  calibration: z.array(z.string()),
  testing: z.object({
    unit: z.array(z.string()),
    integration: z.array(z.string()),
    acceptance: z.array(z.string())
  }),
  common_failures: z.array(z.object({
    issue: z.string(),
    cause: z.string(),
    fix: z.string()
  })),
  safety: z.array(z.string()),
  next_steps: z.array(z.string())
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

    const parseResult = aiOutputSchema.safeParse(aiOutput);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "AI output is missing required fields or has invalid types" },
        { status: 400 }
      );
    }

    // Verify project exists and has a blueprint
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { 
        id: true,
        blueprint: { select: { id: true } }
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    if (!project.blueprint) {
      return NextResponse.json(
        { error: "Blueprint not found for this project" },
        { status: 400 }
      );
    }

    const normalized = parseResult.data;

    const buildGuide = await prisma.$transaction(async (tx) => {
      const base = await tx.buildGuide.upsert({
        where: { projectId },
        update: {
          build_overview: normalized.build_overview,
          calibration: normalized.calibration,
          safety: normalized.safety,
          next_steps: normalized.next_steps,
          updatedAt: new Date()
        },
        create: {
          projectId,
          build_overview: normalized.build_overview,
          calibration: normalized.calibration,
          safety: normalized.safety,
          next_steps: normalized.next_steps
        }
      });

      await tx.prerequisite.upsert({
        where: { buildGuideId: base.id },
        update: {
          tools: normalized.prerequisites.tools,
          materials: normalized.prerequisites.materials
        },
        create: {
          buildGuideId: base.id,
          tools: normalized.prerequisites.tools,
          materials: normalized.prerequisites.materials
        }
      });

      await tx.wiring.upsert({
        where: { buildGuideId: base.id },
        update: {
          description: normalized.wiring.description,
          connections: normalized.wiring.connections
        },
        create: {
          buildGuideId: base.id,
          description: normalized.wiring.description,
          connections: normalized.wiring.connections
        }
      });

      await tx.firmware.upsert({
        where: { buildGuideId: base.id },
        update: {
          language: normalized.firmware.language,
          structure: normalized.firmware.structure,
          key_logic: normalized.firmware.key_logic
        },
        create: {
          buildGuideId: base.id,
          language: normalized.firmware.language,
          structure: normalized.firmware.structure,
          key_logic: normalized.firmware.key_logic
        }
      });

      await tx.buildTesting.upsert({
        where: { buildGuideId: base.id },
        update: {
          unit: normalized.testing.unit.join("\n"),
          integration: normalized.testing.integration,
          acceptance: normalized.testing.acceptance
        },
        create: {
          buildGuideId: base.id,
          unit: normalized.testing.unit.join("\n"),
          integration: normalized.testing.integration,
          acceptance: normalized.testing.acceptance
        }
      });

      await tx.commonFailures.deleteMany({ where: { buildGuideId: base.id } });
      for (const failure of normalized.common_failures) {
        await tx.commonFailures.create({
          data: {
            buildGuideId: base.id,
            issue: failure.issue,
            cause: failure.cause,
            fix: failure.fix
          }
        });
      }

      return base;
    });

    // Update project stage
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { stage: "BUILDING" }
    });

    return NextResponse.json(
      {
        projectId,
        buildGuideId: buildGuide.id,
        stage: updatedProject.stage
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/projects/[id]/build-guide/generate] Error:", error);
    return NextResponse.json(
      { error: "Failed to process build guide" },
      { status: 500 }
    );
  }
}
