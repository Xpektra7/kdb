import DecisionMatrixClient from "@/app/app/decision-matrix/DecisionMatrixClient";
import dummyData from "@/schema/air-quality-result2.json";
import type { DecisionMatrixOutput } from "@/lib/definitions";

// Transform database format to DecisionMatrixOutput format
function transformToDecisionMatrixOutput(project: any): DecisionMatrixOutput {
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

export default function Page() {
  const transformedData = transformToDecisionMatrixOutput(dummyData);
  
  return (
    <main className="">
      <DecisionMatrixClient output={transformedData} dummy={true} />
    </main>
  );
}
