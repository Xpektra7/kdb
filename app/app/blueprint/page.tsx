import { dummydata } from "@/schema/air-quality-result";
import type { Blueprint } from "@/lib/definitions";
import BlueprintClient from "./BlueprintClient";

export const dynamic = "force-dynamic";

async function fetchBlueprintFromProject(projectId: string): Promise<Blueprint> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  // Fetch the cached blueprint from the project's blueprint endpoint
  const response = await fetch(`${baseUrl}/api/projects/${projectId}/blueprint`, {
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 410) {
      throw new Error("Blueprint has expired. Please regenerate.");
    }
    if (response.status === 404) {
      throw new Error("Blueprint not found. Please generate it first.");
    }
    throw new Error(`Blueprint fetch failed: ${response.status}`);
  }

  return response.json();
}

export default async function Page({ searchParams }: { searchParams?: Promise<{ projectId?: string }> }) {
  try {
    const params = await searchParams ?? {};

    // Use projectId from persistent storage
    if (params.projectId) {
      const blueprintData = await fetchBlueprintFromProject(params.projectId);
      return <BlueprintClient blueprintData={blueprintData} projectId={parseInt(params.projectId)} />;
    }

    return null;
  } catch (err) {
    console.error("Blueprint page error:", err);
  }
}
