import type { BuildGuide } from "@/lib/definitions";
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

export default async function Page({ searchParams }: { searchParams?: Promise<{ projectId?: string }> }) {
  
  try {
    const params = await searchParams ?? {};

    // Use projectId from persistent storage
    if (params.projectId) {
      const buildGuideData = await fetchBuildGuideFromProject(params.projectId);
      return <BuildGuideClient buildGuideData={buildGuideData} projectId={parseInt(params.projectId)} />;
    }


    return null;
  } catch (err) {
    console.error("Build guide page error:", err);
  }
}
