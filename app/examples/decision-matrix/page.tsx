import DecisionMatrixClient from "@/app/app/decision-matrix/DecisionMatrixClient";
import dummyData from "@/schema/air-quality-result2.json";

export default function Page() {
  return (
    <main className="">
      <DecisionMatrixClient  output={dummyData.output} dummy={true} />
    </main>
  );
}
