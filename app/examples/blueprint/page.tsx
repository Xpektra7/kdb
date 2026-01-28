import BlueprintClient from "@/app/app/blueprint/BlueprintClient";
import { dummydata } from "@/schema/air-quality-result";

export default function Page() {
  return (
    <main className="">
      <BlueprintClient blueprintData={dummydata} dummy={true} />
    </main>
  );
}
