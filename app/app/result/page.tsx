"use client";
import { useRouter } from "next/navigation";
import DecisionMatrix from "@/components/decision-matrix/decision-matrix";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useResultStore } from "@/components/providers/result-store";

export default function ResultPage() {
  const router = useRouter();
  const { result } = useResultStore();

  const hasResult = Boolean(result);

  return (
    <main className="relative p-page-lg flex h-auto flex-col items-center justify-center max-w-[1440px] py-0 pb-12 mx-auto">
      <div className="flex w-full justify-between items-center border-b border-border p-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-foreground">Decision Matrix</h1>
          <Badge className="text-muted-foreground" variant="secondary">Latest generated result</Badge>
        </div>
        <Button variant="outline" size="sm" className="px-6" onClick={() => router.push("/app")}>Back</Button>
      </div>

      <div className="flex flex-col w-full gap-6 mt-12">
        {!hasResult ? (
          <div className="flex flex-col gap-2 rounded-lg border border-border p-8 text-center">
            <p className="text-lg font-semibold text-foreground">No data available</p>
            <p className="text-muted-foreground">Generate a matrix first, then you'll see it here.</p>
            <div className="flex justify-center">
              <Button onClick={() => router.push("/app")}>Start a new matrix</Button>
            </div>
          </div>
        ) : (
          <div className="w-full h-auto flex flex-col gap-4">
            <p className="max-w-2xl text-muted-foreground">
              Analyze and compare different options based on multiple criteria to make informed decisions.
            </p>
            <DecisionMatrix output={result} />
          </div>
        )}
      </div>
    </main>
  );
}
