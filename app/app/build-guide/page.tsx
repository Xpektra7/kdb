import { redirect } from "next/navigation";
import type { BuildGuide } from "@/lib/definitions";
import { getDataModeServer } from "@/lib/data-mode.server";
import { buildGuideDummyData } from "@/schema/build-guide-dummy";
import BuildGuideClient from "./BuildGuideClient";

async function fetchBuildGuideFromProject(projectId: string): Promise<BuildGuide> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  // Fetch project with build guide data
  const response = await fetch(`${baseUrl}/api/projects/${projectId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Project not found: ${response.status}`);
  }

  const project = await response.json();
  
  if (!project.buildGuide) {
    throw new Error("Build guide not found for this project");
  }

  // Transform the database build guide to the expected format
  return project.buildGuide.aiOutput as BuildGuide;
}

export default async function Page({ searchParams }: { searchParams: Promise<{ projectId?: string; requestId?: string }> }) {
  
  try {
    const params = await searchParams;
    const useDummyData = await getDataModeServer();

    if (useDummyData) {
      return <BuildGuideClient buildGuideData={buildGuideDummyData} dummy />;
    }

    // New flow: Use projectId from persistent storage
    if (params.projectId) {
      const buildGuideData = await fetchBuildGuideFromProject(params.projectId);
      return <BuildGuideClient buildGuideData={buildGuideData} projectId={parseInt(params.projectId)} />;
    }


    throw new Error("Missing projectId or requestId");
  } catch (err) {
    console.error("Build guide page error:", err);
  }
}
