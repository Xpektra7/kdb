import BlueprintClient from "@/app/app/blueprint/BlueprintClient";
import { dummydata } from "@/schema/air-quality-result";
import type { Blueprint } from "@/lib/definitions";

export default function Page() {
  return (
    <main className="">
      <BlueprintClient blueprintData={dummydata as Blueprint} dummy={true} />
    </main>
  );
}
