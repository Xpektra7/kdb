import { redirect } from "next/navigation";
import { dummydata } from "@/schema/air-quality-result";
import { getDataModeServer } from "@/lib/data-mode.server";
import type { Blueprint } from "@/lib/definitions";
import BlueprintClient from "./BlueprintClient";

async function fetchBlueprintRequest(requestId: string): Promise<{ project: string; selectedOptions: Record<string, unknown> }> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/blueprint-requests/${requestId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Blueprint request not found: ${response.status}`);
  }

  return response.json();
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

export default async function Page({ searchParams }: { searchParams: Promise<{ requestId: string }> }) {
  try {
    const params = await searchParams;
    const useDummyData = await getDataModeServer();

    if (useDummyData) {
      return <BlueprintClient blueprintData={dummydata as unknown as Blueprint} />;
    }

    if (!params.requestId) {
      throw new Error("Missing blueprint requestId");
    }

    // Fetch the stored request
    const { project, selectedOptions } = await fetchBlueprintRequest(params.requestId);
    
    // Generate blueprint from the stored selections
    const blueprintData = await generateBlueprint(project, selectedOptions);

    return <BlueprintClient blueprintData={blueprintData} />;
  } catch (err) {
    console.error("Blueprint page error:", err);
  }
}