import DecisionMatrixClient from "./DecisionMatrixClient";
import type { DecisionMatrixOutput } from "@/lib/definitions";

export const dynamic = "force-dynamic";

// Transform database project format to DecisionMatrixOutput format
function transformProjectToDecisionMatrixOutput(project: any): DecisionMatrixOutput {
  return {
    id: project.id,
    title: project.title,
    project: project.title,
    concept: project.concept || "",
    research: project.research || [],
    goals: project.goals || [],
    problems_overall: project.problems_overall || [],
    subsystems: (project.subsystems || []).map((subsystem: any) => ({
      id: subsystem.id,
      subsystem: subsystem.name,
      inputFrom: subsystem.inputFrom,
      outputTo: subsystem.outputTo,
      options: (subsystem.options || []).map((option: any) => ({
        id: option.id,
        name: option.name,
        why_it_works: option.why_it_works,
        features: option.features || [],
        pros: option.pros || [],
        cons: option.cons || [],
        estimated_cost: option.estimated_cost || "N/A",
        availability: option.availability || "Unknown"
      }))
    })),
    cost: project.cost || ""
  };
}

async function fetchProject(projectId: string): Promise<{ project: any; decisionMatrixOutput: DecisionMatrixOutput }> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/projects/${projectId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Project not found: ${response.status}`);
  }

  const project = await response.json();
  const decisionMatrixOutput = transformProjectToDecisionMatrixOutput(project);
  
  return { project, decisionMatrixOutput };
}


export default async function Page({ searchParams }: { searchParams?: { projectId?: string } }) {
  try {
    const params = searchParams ?? {};
    
    // New flow: Use projectId from persistent storage
    if (params.projectId) {
      const { project, decisionMatrixOutput } = await fetchProject(params.projectId);
      return <DecisionMatrixClient output={decisionMatrixOutput} projectId={parseInt(params.projectId)} />;
    }

    return null;
  } catch (err) {
    console.error("Decision matrix page error:", err);
  }
}
