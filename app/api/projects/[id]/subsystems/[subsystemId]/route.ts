import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/projects/[id]/subsystems/[subsystemId]
 * 
 * Get single subsystem with all options and current decision
 * 
 * Response: {
 *   id, name, description, order,
 *   options: [{id, name, pros, cons, cost, ...}],
 *   currentDecision: {optionId, optionName, decidedAt}
 * }
 */
export async function GET(
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

    const subsystem = await prisma.subsystem.findFirst({
      where: {
        id: subsysId,
        projectId
      },
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
          include: {
            selectedOption: {
              select: {
                id: true,
                name: true
              }
            }
          },
          take: 1
        }
      }
    });

    if (!subsystem) {
      return NextResponse.json(
        { error: "Subsystem not found" },
        { status: 404 }
      );
    }

    const response = {
      id: subsystem.id,
      name: subsystem.name,
      description: subsystem.description,
      order: subsystem.order,
      options: subsystem.options,
      currentDecision: subsystem.decisions.length > 0
        ? {
            optionId: subsystem.decisions[0].selectedOptionId,
            optionName: subsystem.decisions[0].selectedOption.name,
            decidedAt: subsystem.decisions[0].decidedAt
          }
        : null
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("[GET /api/projects/[id]/subsystems/[subsystemId]] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subsystem" },
      { status: 500 }
    );
  }
}
