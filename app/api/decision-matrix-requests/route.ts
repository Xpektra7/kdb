import { NextRequest, NextResponse } from "next/server";
import { saveDecisionMatrix } from "@/lib/decision-matrix-store";

/**
 * POST /api/decision-matrix-requests
 * 
 * Stores a decision matrix generation result and returns a short ID.
 * 
 * Request: { project: string, decisionMatrixOutput: unknown }
 * Response: { requestId: string }
 * 
 * TODO for backend dev: Replace in-memory store with DB + auth validation.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project, decisionMatrixOutput } = body;

    console.log("[DM POST] Received body:", { project, hasOutput: !!decisionMatrixOutput });

    if (!project || !decisionMatrixOutput) {
      console.error("[DM POST] Missing project or decisionMatrixOutput");
      return NextResponse.json(
        { error: "Missing project or decisionMatrixOutput" },
        { status: 400 }
      );
    }

    const requestId = saveDecisionMatrix({ project, decisionMatrixOutput });
    console.log("[DM POST] Saved DM with requestId:", requestId);

    return NextResponse.json({ requestId }, { status: 201 });
  } catch (error) {
    console.error("Error saving decision matrix request:", error);
    return NextResponse.json(
      { error: "Failed to save decision matrix request" },
      { status: 500 }
    );
  }
}
