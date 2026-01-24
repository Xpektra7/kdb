import { NextRequest, NextResponse } from "next/server";
import { saveBlueprint } from "@/lib/blueprint-store";

/**
 * POST /api/blueprint-requests
 * 
 * Stores a blueprint generation request and returns a short ID.
 * 
 * Request: { project: string, selectedOptions: Record<string, unknown> }
 * Response: { requestId: string }
 * 
 * TODO for backend dev: Replace in-memory store with DB + auth validation.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project, selectedOptions } = body;

    if (!project || !selectedOptions) {
      return NextResponse.json(
        { error: "Missing project or selectedOptions" },
        { status: 400 }
      );
    }

    const requestId = saveBlueprint({ project, selectedOptions });

    return NextResponse.json({ requestId }, { status: 201 });
  } catch (error) {
    console.error("Error saving blueprint request:", error);
    return NextResponse.json(
      { error: "Failed to save blueprint request" },
      { status: 500 }
    );
  }
}
