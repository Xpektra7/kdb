import DecisionMatrixClient from "@/app/app/decision-matrix/DecisionMatrixClient";
import dummyData from "@/schema/air-quality-result2.json";
import type { DecisionMatrixOutput } from "@/lib/definitions";

export default function Page() {
  return (
    <main className="">
      <DecisionMatrixClient output={dummyData as any} dummy={true} />
    </main>
  );
}
