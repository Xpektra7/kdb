import BuildGuideClient from "@/app/app/build-guide/BuildGuideClient";
import { buildGuideDummyData } from "@/schema/build-guide-dummy";
import type { BuildGuide } from "@/lib/definitions";

export default function Page() {
  return (
    <main className="">
      <BuildGuideClient buildGuideData={buildGuideDummyData as BuildGuide} dummy={true} />
    </main>
  );
}
