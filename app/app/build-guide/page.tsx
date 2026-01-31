import { redirect } from "next/navigation";
import type { BuildGuide } from "@/lib/definitions";
import { getDataModeServer } from "@/lib/data-mode.server";
import { buildGuideDummyData } from "@/schema/build-guide-dummy";
import BuildGuideClient from "./BuildGuideClient";

async function fetchBuildGuideRequest(requestId: string): Promise<{ project: string; buildGuideOutput: BuildGuide }> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/build-guide-requests/${requestId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Build guide request not found: ${response.status}`);
  }

  return response.json();
}

export default async function Page({ searchParams }: { searchParams: Promise<{ requestId?: string }> }) {
  
  try {
    const params = await searchParams;
    const useDummyData = await getDataModeServer();

    if (useDummyData) {
      return <BuildGuideClient buildGuideData={buildGuideDummyData} dummy />;
    }

    if (!params.requestId) {
      throw new Error("Missing build guide requestId");
    }

    // Fetch the stored build guide
    const { buildGuideOutput } = await fetchBuildGuideRequest(params.requestId);

    return <BuildGuideClient buildGuideData={buildGuideOutput} />;
  } catch (err) {
    console.error("Build guide page error:", err);
    redirect("/app");
  }
}
