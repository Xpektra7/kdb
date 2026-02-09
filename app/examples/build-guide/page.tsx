import BuildGuideClient from "@/app/app/build-guide/BuildGuideClient";
import { buildGuideDummyData } from "@/schema/build-guide-dummy";

export default function Page() {
  return (
    <main className="">
      <BuildGuideClient buildGuideData={buildGuideDummyData} dummy={true} />
    </main>
  );
}