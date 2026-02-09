import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { BuildGuide } from "@/lib/definitions";

/**
 * GET /api/projects/[id]/build-guide
 *
 * Returns build guide data in UI-ready shape.
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

    const buildGuide = await prisma.buildGuide.findUnique({
      where: { projectId },
      include: {
        project: { select: { title: true } },
        prerequisites: true,
        wiring: true,
        firmware: true,
        testing: true,
        common_failures: true
      }
    });

    if (!buildGuide) {
      return NextResponse.json(
        { error: "Build guide not found" },
        { status: 404 }
      );
    }

    const testingUnit = buildGuide.testing?.unit
      ? buildGuide.testing.unit.split("\n").filter(Boolean)
      : [];

    const response: BuildGuide = {
      project: buildGuide.project?.title || "",
      build_overview: buildGuide.build_overview,
      prerequisites: {
        tools: buildGuide.prerequisites?.tools || [],
        materials: buildGuide.prerequisites?.materials || []
      },
      wiring: {
        description: buildGuide.wiring?.description || "",
        connections: buildGuide.wiring?.connections || []
      },
      firmware: {
        language: buildGuide.firmware?.language || "",
        structure: buildGuide.firmware?.structure || [],
        key_logic: buildGuide.firmware?.key_logic || []
      },
      calibration: buildGuide.calibration || [],
      testing: {
        unit: testingUnit,
        integration: buildGuide.testing?.integration || [],
        acceptance: buildGuide.testing?.acceptance || []
      },
      common_failures: (buildGuide.common_failures || []).map((failure) => ({
        issue: failure.issue,
        cause: failure.cause,
        fix: failure.fix
      })),
      safety: buildGuide.safety || [],
      next_steps: buildGuide.next_steps || []
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("[GET /api/projects/[id]/build-guide] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch build guide" },
      { status: 500 }
    );
  }
}
