import { NextRequest, NextResponse } from "next/server";
import { getBlueprint } from "@/lib/blueprint-store";

/**
 * GET /api/blueprint-requests/:requestId
 * 
 * Retrieves a stored blueprint request by ID.
 * 
 * Response: { project: string, selectedOptions: Record<string, unknown> }
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

    const blueprintRequest = getBlueprint(requestId);

    if (!blueprintRequest) {
      return NextResponse.json(
        { error: "Blueprint request not found or expired" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        project: blueprintRequest.project,
        selectedOptions: blueprintRequest.selectedOptions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving blueprint request:", error);
    return NextResponse.json(
      { error: "Failed to retrieve blueprint request" },
      { status: 500 }
    );
  }
}
