import { useEffect } from "react";
import ProblemsOverall from "./problems";
import Research from "./research";

export default function DecisionMatrix({ output }: { output: any }) {

  return (
    <div className="w-full flex flex-col justify-center gap-8 p-4 border border-border rounded-lg">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl">{output.project}</h1>
        <p>{output.concept}</p>
      </div>
      {
        output.research && (
          <Research research={output.research} />
        )
      }
      {
        output.problems_overall && (
          <ProblemsOverall problems={output.problems_overall} />
        )
      }
    </div>
  );
}