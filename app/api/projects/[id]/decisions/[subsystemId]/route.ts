import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * PUT /api/projects/[id]/decisions/[subsystemId]
 * 
 * Update a specific decision for a subsystem
 * 
 * Request: { selectedOptionId: number }
 * Response: Updated decision
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; subsystemId: string }> }
) {
  try {
    const { id, subsystemId } = await params;
    const projectId = parseInt(id);
    const subsysId = parseInt(subsystemId);
    const body = await request.json();
    const { selectedOptionId } = body;

    if (isNaN(projectId) || isNaN(subsysId) || !selectedOptionId) {
      return NextResponse.json(
        { error: "Invalid or missing required fields" },
        { status: 400 }
      );
    }

    // Verify option belongs to subsystem
    const option = await prisma.subsystemOption.findFirst({
      where: { id: selectedOptionId, subsystemId: subsysId }
    });

    if (!option) {
      return NextResponse.json(
        { error: "Option not found for this subsystem" },
        { status: 404 }
      );
    }

    const decision = await prisma.projectDecision.update({
      where: {
        projectId_subsystemId: {
          projectId,
          subsystemId: subsysId
        }
      },
      data: {
        selectedOptionId,
        decidedAt: new Date()
      },
      select: {
        id: true,
        projectId: true,
        subsystemId: true,
        selectedOptionId: true,
        decidedAt: true
      }
    });

    return NextResponse.json(decision, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Decision not found" },
        { status: 404 }
      );
    }
    console.error("[PUT /api/projects/[id]/decisions/[subsystemId]] Error:", error);
    return NextResponse.json(
      { error: "Failed to update decision" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects/[id]/decisions/[subsystemId]
 * 
 * Delete a decision for a subsystem
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; subsystemId: string }> }
) {
  try {
    const { id, subsystemId } = await params;
    const projectId = parseInt(id);
    const subsysId = parseInt(subsystemId);

    if (isNaN(projectId) || isNaN(subsysId)) {
      return NextResponse.json(
        { error: "Invalid project or subsystem ID" },
        { status: 400 }
      );
    }

    await prisma.projectDecision.delete({
      where: {
        projectId_subsystemId: {
          projectId,
          subsystemId: subsysId
        }
      }
    });

    return NextResponse.json(
      { message: "Decision deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Decision not found" },
        { status: 404 }
      );
    }
    console.error("[DELETE /api/projects/[id]/decisions/[subsystemId]] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete decision" },
      { status: 500 }
    );
  }
}
