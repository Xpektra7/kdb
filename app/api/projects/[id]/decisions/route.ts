import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/projects/[id]/decisions
 * 
 * Get all decisions made for a project
 * 
 * Response: {
 *   decisions: [{
 *     id, subsystemId, subsystemName,
 *     selectedOptionId, selectedOptionName,
 *     decidedAt
 *   }]
 * }
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

    const decisions = await prisma.projectDecision.findMany({
      where: { projectId },
      include: {
        subsystem: {
          select: { id: true, name: true }
        },
        selectedOption: {
          select: { id: true, name: true }
        }
      },
      orderBy: { decidedAt: "desc" }
    });

    const formatted = decisions.map(d => ({
      id: d.id,
      subsystemId: d.subsystem.id,
      subsystemName: d.subsystem.name,
      selectedOptionId: d.selectedOption.id,
      selectedOptionName: d.selectedOption.name,
      decidedAt: d.decidedAt
    }));

    return NextResponse.json({ decisions: formatted }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/projects/[id]/decisions] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch decisions" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects/[id]/decisions
 * 
 * Create or update a decision for a subsystem
 * 
 * Request: { subsystemId: number, selectedOptionId: number }
 * Response: { id, subsystemId, selectedOptionId, decidedAt }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    console.log('yes we are getting there')
    const { id } = await params;
    const projectId = parseInt(id);
    const body = await request.json();
    const { subsystemId, selectedOptionId } = body;

    console.log('================')
    console.log(subsystemId, selectedOptionId)
    console.log('====================')

    if (isNaN(projectId) || !subsystemId || !selectedOptionId) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    // Verify subsystem belongs to project
    const subsystem = await prisma.subsystem.findFirst({
      where: { id: subsystemId, projectId }
    });

    if (!subsystem) {
      return NextResponse.json(
        { error: "Subsystem not found in this project" },
        { status: 404 }
      );
    }

    // Verify option belongs to subsystem
    const option = await prisma.subsystemOption.findFirst({
      where: { id: selectedOptionId, subsystemId }
    });

    if (!option) {
      return NextResponse.json(
        { error: "Option not found for this subsystem" },
        { status: 404 }
      );
    }

    // Upsert decision (create or update)
    const decision = await prisma.projectDecision.upsert({
      where: {
        projectId_subsystemId: {
          projectId,
          subsystemId
        }
      },
      update: {
        selectedOptionId,
        decidedAt: new Date()
      },
      create: {
        projectId,
        subsystemId,
        selectedOptionId
      },
      select: {
        id: true,
        projectId: true,
        subsystemId: true,
        selectedOptionId: true,
        decidedAt: true
      }
    });

    return NextResponse.json(decision, { status: 201 });
  } catch (error) {
    console.error("[POST /api/projects/[id]/decisions] Error:", error);
    return NextResponse.json(
      { error: "Failed to save decision" },
      { status: 500 }
    );
  }
}
