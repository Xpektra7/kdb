import { NextRequest, NextResponse } from "next/server";
import { saveBuildGuide } from "@/lib/build-guide-store";

/**
 * POST /api/build-guide-requests
 * 
 * Stores a build guide generation result and returns a short ID.
 * 
 * Request: { project: string, buildGuideOutput: BuildGuide }
 * Response: { requestId: string }
 * 
 * TODO for backend dev: Replace in-memory store with DB + auth validation.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project, buildGuideOutput } = body;

    if (!project || !buildGuideOutput) {
      return NextResponse.json(
        { error: "Missing project or buildGuideOutput" },
        { status: 400 }
      );
    }

    const requestId = saveBuildGuide({ project, buildGuideOutput });

    return NextResponse.json({ requestId }, { status: 201 });
  } catch (error) {
    console.error("Error saving build guide request:", error);
    return NextResponse.json(
      { error: "Failed to save build guide request" },
      { status: 500 }
    );
  }
}
