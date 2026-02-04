import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

    // Flatten connections array
    const wiringConnections = aiOutput.wiring?.connections || [];
    const wiringConnectionsFlat = wiringConnections.reduce((acc: string[], item: any) => {
      if (Array.isArray(item)) {
        acc.push(...item);
      } else if (typeof item === "string") {
        acc.push(item);
      }
      return acc;
    }, []);

    // Create build guide with normalized data
    const buildGuide = await prisma.buildGuide.upsert({
      where: { projectId },
      update: {
        buildOverview: aiOutput.build_overview || "",
        prerequisites: aiOutput.prerequisites || { tools: [], materials: [] },
        wiringDescription: aiOutput.wiring?.description || "",
        wiringConnections: wiringConnectionsFlat,
        firmwareLanguage: aiOutput.firmware?.language || "",
        firmwareStructure: aiOutput.firmware?.structure || [],
        firmwareKeyLogic: aiOutput.firmware?.key_logic || [],
        calibrationSteps: aiOutput.calibration || [],
        testingUnit: aiOutput.testing?.unit || [],
        testingIntegration: aiOutput.testing?.integration || [],
        testingAcceptance: aiOutput.testing?.acceptance || [],
        commonFailures: aiOutput.common_failures || [],
        safety: aiOutput.safety || [],
        nextSteps: aiOutput.next_steps || [],
        updatedAt: new Date()
      },
      create: {
        projectId,
        blueprintId: project.blueprint.id,
        buildOverview: aiOutput.build_overview || "",
        prerequisites: aiOutput.prerequisites || { tools: [], materials: [] },
        wiringDescription: aiOutput.wiring?.description || "",
        wiringConnections: wiringConnectionsFlat,
        firmwareLanguage: aiOutput.firmware?.language || "",
        firmwareStructure: aiOutput.firmware?.structure || [],
        firmwareKeyLogic: aiOutput.firmware?.key_logic || [],
        calibrationSteps: aiOutput.calibration || [],
        testingUnit: aiOutput.testing?.unit || [],
        testingIntegration: aiOutput.testing?.integration || [],
        testingAcceptance: aiOutput.testing?.acceptance || [],
        commonFailures: aiOutput.common_failures || [],
        safety: aiOutput.safety || [],
        nextSteps: aiOutput.next_steps || []
      }
    });

    // Update project stage
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { stage: "BUILDING" }
    });

    // Track AI generation
    const projectUserId = (await prisma.project.findUnique({ 
      where: { id: projectId }, 
      select: { userId: true } 
    }))?.userId || "";

    await prisma.aIGeneration.create({
      data: {
        projectId,
        userId: projectUserId,
        stage: "BUILD_GUIDE",
        status: "SUCCESS"
      }
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
