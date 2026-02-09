import type { BuildGuide } from "@/lib/definitions";
import { getDataModeServer } from "@/lib/data-mode.server";
import { buildGuideDummyData } from "@/schema/build-guide-dummy";
import BuildGuideClient from "./BuildGuideClient";

export const dynamic = "force-dynamic";

async function fetchBuildGuideFromProject(projectId: string): Promise<BuildGuide> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/projects/${projectId}/build-guide`, {
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Build guide not found for this project");
    }
    throw new Error(`Build guide fetch failed: ${response.status}`);
  }

  return response.json();
}

export default async function Page({ searchParams }: { searchParams?: { projectId?: string } }) {
  
  try {
    const params = searchParams ?? {};
    const useDummyData = await getDataModeServer();

    if (useDummyData) {
      return <BuildGuideClient buildGuideData={buildGuideDummyData} dummy />;
    }

    // New flow: Use projectId from persistent storage
    if (params.projectId) {
      const buildGuideData = await fetchBuildGuideFromProject(params.projectId);
      return <BuildGuideClient buildGuideData={buildGuideData} projectId={parseInt(params.projectId)} />;
    }


    return null;
  } catch (err) {
    console.error("Build guide page error:", err);
  }
}
