import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import ai from "@/lib/ai/ai-config";
import z from "zod";
import { auth } from "@/auth";
import { retryWithBackoff } from "@/lib/utils/retry";
import { ProjectStage } from "@/lib/generated/prisma/enums";

// Temporary userId for demonstration purposes

// const userId = "cml54po810000f4uwbqqsrie3";

const validateInput = {
  title: z.string().min(1),
  location: z.string().default("Nigeria")
};

const aiOptionSchema = z.object({
  name: z.string(),
  why_it_works: z.string(),
  features: z.array(z.string()).optional(),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
  estimated_cost: z.union([z.string(), z.array(z.string())]).optional(),
  availability: z.string().optional()
});

// const normalizeEstimatedCost = (value?: string | string[] | null): string => {
//   if (!value) {
//     return "N/A";
//   }
//   if (Array.isArray(value)) {
//     const cleaned = value.map((item) => item.trim()).filter(Boolean);
//     return cleaned.length ? cleaned.join(", ") : "N/A";
//   }
//   const cleaned = value.trim();
//   return cleaned || "N/A";
// };

const normalizeToStringArray = (value?: string | string[] | null): string[] => {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
};

const aiSubsystemSchema = z.object({
  subsystem: z.string(),
  inputFrom: z.union([z.string(), z.array(z.string()), z.null()]).optional(),
  outputTo: z.union([z.string(), z.array(z.string()), z.null()]).optional(),
  from: z.union([z.string(), z.array(z.string()), z.null()]).optional(),
  to: z.union([z.string(), z.array(z.string()), z.null()]).optional(),
  options: z.array(aiOptionSchema)
});

const aiOutputSchema = z.object({
  project: z.string(),
  concept: z.string(),
  research: z.array(z.string()).optional(),
  goals: z.array(z.string()).optional(),
  problems_overall: z.array(z.object({
    problem: z.string(),
    suggested_solution: z.string()
  })).optional(),
  subsystems: z.array(aiSubsystemSchema),
  decision_matrix: z.array(aiSubsystemSchema).optional(),
});


/**
 * POST /api/projects
 * 
 * Create a new engineering project with AI-generated decision matrix
 * 
 * Request: { title: string, description?: string, location?: string }
 * Response: { projectId: string, subsystemCount: number, optionCount: number, subsystems: Subsystem[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = z.object(validateInput).safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.message },
        // { error: parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ') },
        { status: 400 }
      );
    }

    const { title, location } = parsed.data;

    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - no active session" },
        { status: 401 }
      );
    }

    // const uncompletedProject = await prisma.project.findFirst({
    //   where: {
    //     userId,
    //     NOT: {
    //       stage: "COMPLETED"
    //     }
    //   }
    // });

    // if (uncompletedProject) {
    //   return NextResponse.json(
    //     { error: "You have an uncompleted project. Please complete it before creating a new one." },
    //     { status: 400 }
    //   );
    // }

    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        // concept: description?.trim() || null,
        userId,
        stage: "IDEATION"
      },
      select: {
        id: true,
        title: true,
        // concept: true,
      }
    });

    const input = `You are an engineering project planner. Return ONLY valid minified JSON (no newlines), No prose, markdown, or extra text.
    SCHEMA:
    {
      "project":"string",
      "concept":"string",
      "research":"string[]",
      "goals":["string"],
      "problems_overall":[{"problem":"string","suggested_solution":"string"}],
      "subsystems":[{"subsystem":"string","inputFrom":"string|string[]|null","outputTo":"string|string[]|null","options":[{"name":"string","why_it_works":"string","features":["string"],"pros":["string"],"cons":["string"],"estimated_cost":"string","availability":"string"}]}]
    }
    RULES:
    - Omit subsystems with no viable options.
    - Engineering systems only.
    - Provide 2–4 options per subsystem with real tradeoffs.
    - Keep output concise and execution-focused.
    - research should be list of things user should research to understand the solution, not general background reading.
    - Describe the simplest viable system; extras are optional.
    PROJECT:
    Title: ${title}
    LOCATION:
    ${location}
    `;

    let aiOutput;
    // let tokensUsed = 0;

    try {
      const result = await retryWithBackoff(
        async () => {
          const genResult = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: input,
          });

          const text = genResult.text;
          // tokensUsed = genResult.usageMetadata?.totalTokenCount || 0;
          // console.log(genResult.text);

          const cleanedText = text ? text.replace(/```json\n|\n```/g, "").trim() : "";

          if (!cleanedText) {
            throw new Error("AI returned empty response");
          }

          return JSON.parse(cleanedText);
        },
        {
          maxRetries: 3,
          baseDelayMs: 1000,
          onRetry: (attempt, error) => {
            console.log(`[POST /api/projects] Retry ${attempt}/3 - Error: ${error.message}`);
          }
        }
      );

      aiOutput = result;

      console.log("AI Output:", aiOutput);
    } catch (aiError) {
      // await prisma.aIGeneration.create({
      //   data: {
      //     projectId: project.id,
      //     userId,
      //     stage: "DECISION_MATRIX",
      //     status: "FAILED",
      //     tokensUsed,
      //     errorMessage: aiError instanceof Error ? aiError.message : String(aiError)
      //   }
      // });
      await prisma.project.delete({ where: { id: project.id } });
      console.error("[POST /api/projects] AI generation failed:", aiError);
      return NextResponse.json(
        { error: aiError instanceof Error ? `AI generation failed: ${aiError.message}` : "AI generation failed" },
        { status: 500 }
      );
    }

    console.log("Raw AI Output:", aiOutput);

    const validation = aiOutputSchema.safeParse(aiOutput);

    console.log("AI Output Validation Result:", validation);
    if (!validation.success) {
      await prisma.project.delete({ where: { id: project.id } });
      console.error("[POST /api/projects] AI output validation failed:", validation.error);
      return NextResponse.json(
        { error: "AI output does not match expected schema" },
        { status: 500 }
      );
    }

    const projectId = project.id;
    let createdSubsystems;

    try {
      createdSubsystems = await prisma.$transaction(async (tx) => {
        const subsystemsData = validation.data.subsystems.length
          ? validation.data.subsystems
          : (validation.data.decision_matrix || []);
        const created = [];

        for (let i = 0; i < subsystemsData.length; i++) {
          const subsysData = subsystemsData[i];

          const subsystem = await tx.subsystem.create({
            data: {
              projectId,
              name: subsysData.subsystem,
              inputFrom: normalizeToStringArray(subsysData.inputFrom ?? subsysData.from),
              outputTo: normalizeToStringArray(subsysData.outputTo ?? subsysData.to),
              order: i
            }
          });

          const optionsData = subsysData.options || [];
          const createdOptions = [];

          for (const optionData of optionsData) {
            
            const option = await tx.subsystemOption.create({
              data: {
                subsystemId: subsystem.id,
                name: optionData.name,
                why_it_works: optionData.why_it_works,
                pros: optionData.pros,
                cons: optionData.cons,
                features:optionData.features,
                estimated_cost: Array.isArray(optionData.estimated_cost)
                  ? optionData.estimated_cost.filter(Boolean).join(", ") || "N/A"
                  : optionData.estimated_cost || "N/A",
                availability: optionData.availability || "Unknown"
              }
            });
            createdOptions.push(option);
          }

          created.push({
            id: subsystem.id,
            name: subsystem.name,
            optionCount: createdOptions.length
          });
        }

        for (const problem_overall of validation.data.problems_overall || []) {
          await tx.problemOverall.create({
            data: {
              projectId, ...problem_overall
            }
          })
        }


        await tx.project.update({
          where: { id: projectId },
          data: {
            title:validation.data.project,
            concept: validation.data.concept,
            stage: ProjectStage.DECISION_MATRIX,
            goals: validation.data.goals || [],
            research: validation.data.research || []
          }
        });


        return created;
      });
    } catch (dbError) {
      console.error("[POST /api/projects] Database transaction failed:", dbError);
      return NextResponse.json(
        { error: "Failed to save project data - transaction rolled back" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        projectId,
        subsystemCount: createdSubsystems.length,
        optionCount: createdSubsystems.reduce((sum, s) => sum + s.optionCount, 0),
        subsystems: createdSubsystems
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/projects] Unexpected error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create project" },
      { status: 500 }
    );
  }
}


/** * GET /api/projects
 * 
 * Fetch all projects for the authenticated user 
 * 
 * Response: { projects: Project[] }
 */
export async function GET(request: NextRequest) {
  try {

    // get each project with full details

    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - No authenticated user found" },
        { status: 401 }
      );
    }
    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        subsystems: true,
        blueprint: true,
        buildGuide: true,
        _count: true,
        decisions: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      { projects },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/projects] Unexpected error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // const session = await auth();
    // const userId = session?.user?.id;
    // if (!userId) {
    //   return NextResponse.json(
    //     { error: "Unauthorized - No authenticated user found" },
    //     { status: 401 }
    //   );
    // }

    const deleted = await prisma.project.deleteMany();

    return NextResponse.json(
      { deletedCount: deleted.count },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE /api/projects] Unexpected error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete projects" },
      { status: 500 }
    );
  }
}
