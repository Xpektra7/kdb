import { NextRequest, NextResponse } from "next/server";
import { getDecisionMatrix, getStoreSize } from "@/lib/decision-matrix-store";

/**
 * GET /api/decision-matrix-requests/:requestId
 * 
 * Retrieves a stored decision matrix result by ID.
 * 
 * Response: { project: string, decisionMatrixOutput: unknown }
 * 
 * TODO for backend dev: Replace in-memory store with DB query + auth/ownership validation.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { requestId } = await params;
    
    console.log("[DM GET] Received requestId:", requestId);
    console.log("[DM GET] Store size:", getStoreSize());

    if (!requestId) {
      console.error("[DM GET] requestId is missing or falsy");
      return NextResponse.json(
        { error: "Missing requestId" },
        { status: 400 }
      );
    }

    const dmRequest = getDecisionMatrix(requestId);
    console.log("[DM GET] Retrieved DM request:", dmRequest ? "FOUND" : "NOT_FOUND");

    if (!dmRequest) {
      return NextResponse.json(
        { error: "Decision matrix request not found or expired" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        project: dmRequest.project,
        decisionMatrixOutput: dmRequest.decisionMatrixOutput,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving decision matrix request:", error);
    return NextResponse.json(
      { error: "Failed to retrieve decision matrix request" },
      { status: 500 }
    );
  }
}
