import { redirect } from "next/navigation";
import DecisionMatrixClient from "./DecisionMatrixClient";

async function fetchDecisionMatrixRequest(requestId: string): Promise<{ project: string; decisionMatrixOutput: unknown }> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/decision-matrix-requests/${requestId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Decision matrix request not found: ${response.status}`);
  }

  return response.json();
}

export default async function Page({ searchParams }: { searchParams: Promise<{ requestId?: string }> }) {
  try {
    const params = await searchParams;
    
    if (!params.requestId) {
      throw new Error("Missing decision matrix requestId");
    }

    // Fetch the stored decision matrix
    const { decisionMatrixOutput } = await fetchDecisionMatrixRequest(params.requestId);

    return <DecisionMatrixClient output={decisionMatrixOutput} />;
  } catch (err) {
    console.error("Decision matrix page error:", err);
    redirect("/app");
  }
}
