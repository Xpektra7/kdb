import { redirect } from "next/navigation";
import { dummydata } from "@/schema/air-quality-result";
import { getDataModeServer } from "@/lib/data-mode.server";
import type { Blueprint } from "@/lib/definitions";
import BlueprintClient from "./BlueprintClient";

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

  const blueprintResult = await response.json();
  
  // The aiOutput field contains the full blueprint data
  if (!blueprintResult.aiOutput) {
    throw new Error("Blueprint data is missing");
  }
  
  return blueprintResult.aiOutput as Blueprint;
}

async function generateBlueprint(project: string, selectedOptions: Record<string, unknown>): Promise<Blueprint> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/generate/blueprint`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project, selectedOptions }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Blueprint generation failed: ${response.status}`);
  }

  const { output } = await response.json();
  return typeof output === "string" ? JSON.parse(output) : output;
}

export default async function Page({ searchParams }: { searchParams: Promise<{ projectId?: string; requestId?: string }> }) {
  try {
    const params = await searchParams;
    const useDummyData = await getDataModeServer();

    if (useDummyData) {
      return <BlueprintClient blueprintData={dummydata as unknown as Blueprint} dummy />;
    }

    // New flow: Use projectId from persistent storage
    if (params.projectId) {
      const blueprintData = await fetchBlueprintFromProject(params.projectId);
      return <BlueprintClient blueprintData={blueprintData} projectId={parseInt(params.projectId)} />;
    }

    throw new Error("Missing projectId");
  } catch (err) {
    console.error("Blueprint page error:", err);
  }
}