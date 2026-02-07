import { redirect } from "next/navigation";
import DecisionMatrixClient from "./DecisionMatrixClient";
import type { DecisionMatrixOutput } from "@/lib/definitions";

// Transform database project format to DecisionMatrixOutput format
function transformProjectToDecisionMatrixOutput(project: any): DecisionMatrixOutput {
  return {
    project: project.title,
    concept: project.description || "",
    research: project.research || [], // Research is stored separately in ProjectResearch table
    goals : project.goals ,
    problems_overall: project.problems_overall, // Problems are stored separately
    decision_matrix: project.subsystems.map((subsystem: any) => ({
      subsystem: subsystem.name,
      from: subsystem.inputFrom || null,
      to: subsystem.outputTo || null,
      options: subsystem.options.map((option: any) => ({
        name: option.name,
        why_it_works: option.whyItWorks || option.description,
        features: option.features || [],
        pros: option.pros || [],
        cons: option.cons || [],
        estimated_cost: option.estimatedCost ? [option.estimatedCost] : [],
        availability: option.availability || "Unknown"
      }))
    })),
    cost: "",
    skills: project.decisionMatrix?.skillsRequired || ""
  };
}

async function fetchProject(projectId: string): Promise<{ project: any; decisionMatrixOutput: DecisionMatrixOutput }> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/projects/${projectId}/decision-matrix/`, {
    cache: "no-store",
  });

  console.log("Fetching project decision matrix:", response);

  if (!response.ok) {
    throw new Error(`Project not found: ${response.status}`);
  }

  const project = await response.json();
  console.log(project);
  
  const decisionMatrixOutput = transformProjectToDecisionMatrixOutput(project);
  
  return { project, decisionMatrixOutput };
}


export default async function Page({ searchParams }: { searchParams: Promise<{ projectId?: string }> }) {
  try {
    const params = await searchParams;
    
    // New flow: Use projectId from persistent storage
    if (params.projectId) {
      const { project, decisionMatrixOutput } = await fetchProject(params.projectId);
      return <DecisionMatrixClient output={decisionMatrixOutput} projectId={parseInt(params.projectId)} />;
    }

    throw new Error("Missing projectId");
  } catch (err) {
    console.error("Decision matrix page error:", err);
  }
}
