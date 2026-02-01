import { NextRequest, NextResponse } from "next/server";
import { getBuildGuide } from "@/lib/build-guide-store";

/**
 * GET /api/build-guide-requests/:requestId
 * 
 * Retrieves a stored build guide by ID.
 * 
 * Response: { project: string, buildGuideOutput: BuildGuide }
 * 
 * TODO for backend dev: Replace in-memory store with DB query + auth/ownership validation.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params;

    if (!requestId) {
      return NextResponse.json(
        { error: "Missing requestId" },
        { status: 400 }
      );
    }

    const buildGuideRequest = getBuildGuide(requestId);

    if (!buildGuideRequest) {
      return NextResponse.json(
        { error: "Build guide request not found or expired" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        project: buildGuideRequest.project,
        buildGuideOutput: buildGuideRequest.buildGuideOutput,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving build guide request:", error);
    return NextResponse.json(
      { error: "Failed to retrieve build guide request" },
      { status: 500 }
    );
  }
}
