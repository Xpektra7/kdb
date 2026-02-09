"use client";

import ErrorComponent from "@/components/error/error-boundary";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorComponent
      error={error}
      reset={reset}
      title="Blueprint Error"
      message="Unable to load the blueprint. Please ensure you have completed the decision matrix first."
    />
  );
}
