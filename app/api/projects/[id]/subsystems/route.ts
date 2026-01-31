import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/projects/[id]/subsystems
 * 
 * Get all subsystems for a project with their options
 * 
 * Response: {
 *   subsystems: [{
 *     id, name, description, order,
 *     options: [{id, name, description, pros, cons, cost, availability, ...}],
 *     decision: {optionId, decidedAt} or null
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

    const subsystems = await prisma.subsystem.findMany({
      where: { projectId },
      orderBy: { order: "asc" },
      include: {
        options: {
          select: {
            id: true,
            name: true,
            description: true,
            whyItWorks: true,
            pros: true,
            cons: true,
            estimatedCost: true,
            availability: true,
            imageUrl: true,
            datasheet: true
          }
        },
        decisions: {
          select: {
            selectedOptionId: true,
            decidedAt: true
          },
          take: 1
        }
      }
    });

    if (subsystems.length === 0) {
      return NextResponse.json(
        { error: "No subsystems found for this project" },
        { status: 404 }
      );
    }

    // Format response
    const formatted = subsystems.map(subsystem => ({
      id: subsystem.id,
      name: subsystem.name,
      description: subsystem.description,
      order: subsystem.order,
      options: subsystem.options,
      decision: subsystem.decisions.length > 0 ? subsystem.decisions[0] : null
    }));

    return NextResponse.json({ subsystems: formatted }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/projects/[id]/subsystems] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subsystems" },
      { status: 500 }
    );
  }
}
